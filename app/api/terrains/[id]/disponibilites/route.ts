import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Génère les créneaux horaires pour un terrain à partir des plages d'ouverture
 */
function generateTimeSlots(
  openingTime: string, 
  closingTime: string, 
  durationMinutes: number = 60, 
  priceMultipliers: Array<{startTime: string, endTime: string, multiplier: number}>
): Array<{time: string, endTime: string, available: boolean, priceMultiplier: number}> {
  const slots = [];
  let currentTime = openingTime;
  
  // Fonction pour convertir "HH:MM" en minutes depuis minuit
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  // Fonction pour ajouter des minutes à "HH:MM" et obtenir un nouveau "HH:MM"
  const addMinutes = (time: string, minutes: number): string => {
    let [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };
  
  // Fonction pour déterminer si une heure est entre deux plages, en tenant compte du passage à minuit
  const isTimeBetween = (time: string, start: string, end: string): boolean => {
    const timeMinutes = timeToMinutes(time);
    let startMinutes = timeToMinutes(start);
    let endMinutes = timeToMinutes(end);
    
    // Si l'heure de fin est inférieure à l'heure de début, cela signifie qu'elle est le jour suivant
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60; // Ajouter 24 heures en minutes
      if (timeMinutes < startMinutes) {
        // Si l'heure est après minuit, ajouter 24 heures pour la comparaison
        return timeMinutes + 24 * 60 <= endMinutes;
      }
    }
    
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  };
  
  // Fonction pour trouver le multiplicateur de prix applicable pour une heure donnée
  const findPriceMultiplier = (time: string): number => {
    for (const range of priceMultipliers) {
      if (isTimeBetween(time, range.startTime, range.endTime)) {
        return range.multiplier;
      }
    }
    return 1; // Multiplicateur par défaut si aucune correspondance n'est trouvée
  };
  
  // Gestion spéciale si l'heure de fermeture est le lendemain (par exemple "01:00")
  let closingTimeMinutes = timeToMinutes(closingTime);
  let openingTimeMinutes = timeToMinutes(openingTime);
  
  
  // Générer les créneaux avec un intervalle de durationMinutes
  while (true) {
    const endTime = addMinutes(currentTime, durationMinutes);
    const currentTimeMinutes = timeToMinutes(currentTime);
    // Si l'heure actuelle dépasse l'heure de fermeture, on arrête
    if (currentTimeMinutes >= closingTimeMinutes) {
      break;
    }
    
    // Trouver le multiplicateur de prix pour ce créneau
    const priceMultiplier = findPriceMultiplier(currentTime);
    
    slots.push({
      time: currentTime,
      endTime,
      available: true, // Par défaut, tous les créneaux sont disponibles
      priceMultiplier
    });
    
    currentTime = endTime;
  }
  
  return slots;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Request URL:", request.url);

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    
    if (!date) {
      return new Response(JSON.stringify({ error: "Date parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Requested date:", date);
    
    const client = await clientPromise;
    const db = client.db("terrainBooking");
    
    // 1. Récupérer les informations d'ouverture du terrain pour le jour de la semaine correspondant à la date
    const requestDate = new Date(date);
    const dayOfWeek = requestDate.getDay(); // 0 pour dimanche, 1 pour lundi, etc.
    
    const availabilitySlot = await db.collection("availabilitySlots").findOne({
      fieldId: new ObjectId(id),
      dayOfWeek: dayOfWeek
    });
    
    if (!availabilitySlot) {
      return new Response(JSON.stringify({ 
        error: "No availability information found for this day",
        availableSlots: [] 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // 2. Générer tous les créneaux possibles à partir des heures d'ouverture
    const allSlots = generateTimeSlots(
      availabilitySlot.openingTime, 
      availabilitySlot.closingTime, 
      60, // Durée de 1 heure par créneau par défaut
      availabilitySlot.priceMultiplier
    );

    // 3. Récupérer toutes les réservations existantes pour ce terrain à cette date
    const existingReservations = await db.collection("reservations").find({
      fieldId: new ObjectId(id),
      date: date
    }).toArray();
    
    // 4. Marquer les créneaux comme non disponibles s'ils sont déjà réservés
    const reservedTimes = new Set(existingReservations.map(reservation => reservation.startTime));
    
    const availableSlots = allSlots.map(slot => ({
      time: slot.time,
      available: !reservedTimes.has(slot.time),
      priceMultiplier: slot.priceMultiplier
    }));
    
    return new Response(JSON.stringify({ availableSlots }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error fetching availability:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
