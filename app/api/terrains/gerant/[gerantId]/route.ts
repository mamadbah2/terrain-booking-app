import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { gerantId: string } }
) {
  try {
    const { gerantId } = await params

    if (!gerantId) {
      return NextResponse.json({ error: "ID du gérant requis" }, { status: 400 })
    }

    // Vérifier que l'ID est valide
    if (!ObjectId.isValid(gerantId)) {
      return NextResponse.json({ error: "ID du gérant invalide" }, { status: 400 })
    }

    // Connexion à MongoDB
    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Rechercher le terrain géré par ce gérant
    const terrain = await db.collection("terrains").findOne({
      managerId: new ObjectId(gerantId)
    })

    if (!terrain) {
      return NextResponse.json({ 
        success: true,
        terrain: null,
        message: "Aucun terrain assigné à ce gérant" 
      })
    }

    // Récupérer les horaires d'ouverture depuis availabilitySlots
    const availabilitySlot = await db.collection("availabilitySlots").findOne({
      fieldId: terrain._id,
      dayOfWeek: 1 // Lundi comme référence pour les horaires généraux
    })

    // Récupérer les informations du propriétaire
    const proprietaire = await db.collection("users").findOne({
      _id: terrain.ownerId
    })

    // Formater la réponse
    const formattedTerrain = {
      id: terrain._id.toString(),
      name: terrain.name,
      description: terrain.description,
      location: terrain.location,
      price: terrain.pricePerHour,
      sport: terrain.sport,
      surface: terrain.surface,
      capacity: terrain.capacity,
      dimensions: terrain.dimensions,
      images: terrain.images || [],
      amenities: terrain.amenities || [],
      isActive: terrain.isActive,
      ownerId: terrain.ownerId.toString(),
      managerId: terrain.managerId.toString(),
      operatingHours: {
        opening: availabilitySlot?.openingTime || "08:00",
        closing: availabilitySlot?.closingTime || "22:00"
      },
      proprietaire: proprietaire ? {
        id: proprietaire._id.toString(),
        name: proprietaire.username,
        email: proprietaire.email
      } : null
    }

    return NextResponse.json({
      success: true,
      terrain: formattedTerrain
    })

  } catch (error) {
    console.error("Erreur lors de la récupération du terrain:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}