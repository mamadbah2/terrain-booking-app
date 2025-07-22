import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["terrainId", "date", "timeSlot", "firstName", "lastName", "contactMethod"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis` }, { status: 400 })
      }
    }

    // Validate contact information based on method
    if (body.contactMethod === "phone" && !body.phone) {
      return NextResponse.json({ error: "Le numéro de téléphone est requis" }, { status: 400 })
    }
    if (body.contactMethod === "email" && !body.email) {
      return NextResponse.json({ error: "L'adresse email est requise" }, { status: 400 })
    }

    // Connecter à MongoDB
    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Vérifier que le terrain existe
    const terrain = await db.collection("terrains").findOne({
      _id: new ObjectId(body.terrainId)
    })

    if (!terrain) {
      return NextResponse.json({ error: "Terrain introuvable" }, { status: 404 })
    }

    // Vérifier la disponibilité du créneau
    const existingReservation = await db.collection("reservations").findOne({
      fieldId: new ObjectId(body.terrainId),
      date: body.date,
      startTime: body.timeSlot
    })

    if (existingReservation) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 })
    }

    // Générer le code de réservation unique
    const generateCode = (): string => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let result = ""
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    const reservationCode = `TB-${body.date.replace(/-/g, '')}-${generateCode()}`

    // Calculer l'heure de fin (durée par défaut: 1 heure)
    const startTime = body.timeSlot
    const [hours, minutes] = startTime.split(':').map(Number)
    const duration = body.duration || 60 // durée en minutes
    const endHours = Math.floor((hours * 60 + minutes + duration) / 60)
    const endMinutes = (hours * 60 + minutes + duration) % 60
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

    // Créer la réservation
    const reservation = {
      fieldId: new ObjectId(body.terrainId),
      date: body.date,
      startTime: startTime,
      endTime: endTime,
      durationMinutes: duration,
      totalPrice: body.totalPrice || 25000, // Prix par défaut si non fourni
      status: "pending",
      reservationCode: reservationCode,
      guestName: `${body.firstName} ${body.lastName}`,
      guestPhoneNumber: body.contactMethod === "phone" ? body.phone : null,
      guestEmail: body.contactMethod === "email" ? body.email : null,
      bookedAt: new Date().toISOString(),
      paymentId: null,
    }

    // Insérer en base de données
    const result = await db.collection("reservations").insertOne(reservation)

    if (!result.insertedId) {
      return NextResponse.json({ error: "Erreur lors de la création de la réservation" }, { status: 500 })
    }

    // Simulation d'envoi SMS/Email
    console.log(
      `Envoi du code de réservation ${reservationCode} à ${body.contactMethod === "phone" ? body.phone : body.email}`,
    )

    return NextResponse.json({
      success: true,
      reservation: {
        id: result.insertedId.toString(),
        code: reservationCode,
        ...body,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      reservationCode,
      message: "Réservation créée avec succès",
    })
  } catch (error) {
    console.error("Error creating guest reservation:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
