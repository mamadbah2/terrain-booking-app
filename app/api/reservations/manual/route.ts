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

    // Generate unique reservation code
    const generateCode = (): string => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let result = ""
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    const reservationCode = generateCode()

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real application, you would:
    // 1. Validate the terrain availability
    // 2. Create the reservation in the database
    // 3. Mark it as a manual booking by staff
    // 4. Send confirmation to customer

    const reservation = {
      id: `manual_${Date.now()}`,
      code: reservationCode,
      ...body,
      status: "Confirmé",
      manualBooking: true,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      reservation,
      reservationCode,
      message: "Réservation manuelle créée avec succès",
    })
  } catch (error) {
    console.error("Error creating manual reservation:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
