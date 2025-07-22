import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { reservationId: string } }
) {
  try {
    const { reservationId } = await params
    const { status } = await request.json()

    if (!reservationId || !ObjectId.isValid(reservationId)) {
      return NextResponse.json({ error: "ID de réservation invalide" }, { status: 400 })
    }

    if (!status) {
      return NextResponse.json({ error: "Statut requis" }, { status: 400 })
    }

    // Mapper les statuts français vers les statuts de la BDD
    const statusMap: { [key: string]: string } = {
      "En attente": "pending",
      "Confirmé": "confirmed",
      "Payé": "paid",
      "Utilisé": "completed",
      "Annulé": "cancelled"
    }

    const dbStatus = statusMap[status] || status

    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Mettre à jour le statut de la réservation
    const result = await db.collection("reservations").updateOne(
      { _id: new ObjectId(reservationId) },
      { $set: { status: dbStatus } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Statut mis à jour avec succès"
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}