import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

// GET - Récupérer toutes les réservations avec pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const terrainId = searchParams.get("terrainId")
    const date = searchParams.get("date")

    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Construire le filtre
    const filter: any = {}
    if (status) filter.status = status
    if (terrainId) filter.fieldId = new ObjectId(terrainId)
    if (date) filter.date = date

    // Calculer le skip pour la pagination
    const skip = (page - 1) * limit

    // Récupérer les réservations avec jointure des terrains
    const reservations = await db.collection("reservations")
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "terrains",
            localField: "fieldId",
            foreignField: "_id",
            as: "terrain"
          }
        },
        { $unwind: "$terrain" },
        { $sort: { bookedAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray()

    // Compter le total pour la pagination
    const total = await db.collection("reservations").countDocuments(filter)

    // Formater les réservations
    const formattedReservations = reservations.map(reservation => ({
      id: reservation._id.toString(),
      reservationCode: reservation.reservationCode,
      terrain: {
        id: reservation.terrain._id.toString(),
        name: reservation.terrain.name,
        location: reservation.terrain.location,
        image: reservation.terrain.images?.[0] || "/placeholder.svg"
      },
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      durationMinutes: reservation.durationMinutes,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      guestName: reservation.guestName,
      guestPhoneNumber: reservation.guestPhoneNumber,
      guestEmail: reservation.guestEmail,
      bookedAt: reservation.bookedAt,
      paymentId: reservation.paymentId
    }))

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
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}