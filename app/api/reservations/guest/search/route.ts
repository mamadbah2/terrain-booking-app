import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, contact } = body

    if (!code) {
      return NextResponse.json({ error: "Le code de réservation est requis" }, { status: 400 })
    }

    // Connecter à MongoDB
    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Rechercher la réservation par code
    const reservation = await db.collection("reservations").findOne({
      reservationCode: code.toUpperCase()
    })

    if (!reservation) {
      return NextResponse.json({ error: "Aucune réservation trouvée avec ce code" }, { status: 404 })
    }

    // Récupérer les informations du terrain
    const terrain = await db.collection("terrains").findOne({
      _id: reservation.fieldId
    })

    if (!terrain) {
      return NextResponse.json({ error: "Terrain associé introuvable" }, { status: 404 })
    }

    // Vérification optionnelle des informations de contact pour plus de sécurité
    if (contact) {
      const contactMatch =
        (reservation.guestPhoneNumber && reservation.guestPhoneNumber.includes(contact)) ||
        (reservation.guestEmail && reservation.guestEmail.toLowerCase().includes(contact.toLowerCase()))

      if (!contactMatch) {
        return NextResponse.json(
          {
            error: "Les informations de contact ne correspondent pas à cette réservation",
          },
          { status: 403 },
        )
      }
    }

    // Calculer la durée en heures
    const durationHours = Math.floor(reservation.durationMinutes / 60)

    // Formater la réponse
    const formattedReservation = {
      code: reservation.reservationCode,
      terrainName: terrain.name,
      terrainLocation: terrain.location,
      terrainImage: terrain.images?.[0] || "/placeholder.svg?height=200&width=300",
      date: reservation.date,
      timeSlot: reservation.startTime,
      endTime: reservation.endTime,
      duration: durationHours,
      firstName: reservation.guestName.split(' ')[0],
      lastName: reservation.guestName.split(' ').slice(1).join(' '),
      contactMethod: reservation.guestPhoneNumber ? "phone" : "email",
      phone: reservation.guestPhoneNumber,
      email: reservation.guestEmail,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      createdAt: reservation.bookedAt,
    }

    return NextResponse.json({
      success: true,
      reservation: formattedReservation,
    })
  } catch (error) {
    console.error("Error searching reservation:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
