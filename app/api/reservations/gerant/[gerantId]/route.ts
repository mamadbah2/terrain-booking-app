import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { gerantId: string } }
) {
  try {
    const { gerantId } = await params
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    const search = searchParams.get("search")

    if (!gerantId) {
      return NextResponse.json({ error: "ID du gérant requis" }, { status: 400 })
    }

    if (!ObjectId.isValid(gerantId)) {
      return NextResponse.json({ error: "ID du gérant invalide" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("terrainBooking")

    // D'abord, récupérer le terrain géré par ce gérant
    const terrain = await db.collection("terrains").findOne({
      managerId: new ObjectId(gerantId)
    })

    if (!terrain) {
      return NextResponse.json({
        success: true,
        reservations: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        message: "Aucun terrain assigné à ce gérant"
      })
    }

    // Construire le filtre pour les réservations
    const filter: any = {
      fieldId: terrain._id
    }

    if (status && status !== "all") {
      // Mapper les statuts français vers les statuts de la BDD
      const statusMap: { [key: string]: string } = {
        "En attente": "pending",
        "Confirmé": "confirmed", 
        "Payé": "paid",
        "Utilisé": "completed",
        "Annulé": "cancelled"
      }
      filter.status = statusMap[status] || status
    }

    if (date) {
      filter.date = date
    }

    // Recherche textuelle
    if (search) {
      filter.$or = [
        { reservationCode: { $regex: search, $options: "i" } },
        { guestName: { $regex: search, $options: "i" } }
      ]
    }

    const skip = (page - 1) * limit

    // Récupérer les réservations
    const reservations = await db.collection("reservations")
      .find(filter)
      .sort({ bookedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection("reservations").countDocuments(filter)

    // Formater les réservations pour correspondre à l'interface du composant
    const formattedReservations = reservations.map(reservation => {
      // Mapper les statuts de la BDD vers les statuts français
      const statusMap: { [key: string]: string } = {
        "pending": "En attente",
        "confirmed": "Confirmé",
        "paid": "Payé", 
        "completed": "Utilisé",
        "cancelled": "Annulé"
      }

      // Séparer le nom complet en prénom et nom
      const nameParts = reservation.guestName.split(' ')
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(' ') || ""

      return {
        id: reservation._id.toString(),
        code: reservation.reservationCode,
        terrainName: terrain.name,
        terrainLocation: terrain.location,
        date: reservation.date,
        timeSlot: reservation.startTime,
        duration: Math.round(reservation.durationMinutes / 60), // Convertir en heures
        firstName,
        lastName,
        contactMethod: reservation.guestPhoneNumber ? "phone" : "email" as "phone" | "email",
        phone: reservation.guestPhoneNumber || undefined,
        email: reservation.guestEmail || undefined,
        totalPrice: reservation.totalPrice,
        status: statusMap[reservation.status] || reservation.status,
        createdAt: reservation.bookedAt
      }
    })

    return NextResponse.json({
      success: true,
      reservations: formattedReservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}