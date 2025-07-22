import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session depuis les cookies
    const sessionCookie = request.cookies.get("session")
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 })
    }

    if (!sessionData.userId) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 })
    }

    // Connexion à MongoDB
    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Récupérer l'utilisateur depuis la base de données
    const user = await db.collection("users").findOne({ 
      _id: new ObjectId(sessionData.userId) 
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Préparer les données utilisateur pour la réponse
    const userData = {
      id: user._id.toString(),
      name: user.username,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json({
      success: true,
      user: userData
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
