import clientPromise from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Connexion à MongoDB
    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Rechercher l'utilisateur par email
    const user = await db.collection("users").findOne({ 
      email: email.toLowerCase() 
    })

    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Vérification du mot de passe (sans hachage pour le moment)
    // TODO: Implémenter le hachage des mots de passe avec bcrypt
    console.log("User password:", user.password, "Provided password:", password, "User:", user);
    if (user.password !== password) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Vérifier que l'utilisateur a un rôle staff (proprio ou gerant)
    if (!["proprio", "gerant"].includes(user.role)) {
      return NextResponse.json({ 
        error: "Accès réservé au personnel autorisé" 
      }, { status: 403 })
    }

    // Préparer les données utilisateur pour la réponse
    const userData = {
      id: user._id.toString(),
      name: user.username,
      email: user.email,
      role: user.role,
    }

    const response = NextResponse.json({
      success: true,
      user: userData,
      message: "Connexion réussie"
    })

    // Créer une session simple (en production, utiliser JWT)
    response.cookies.set("session", JSON.stringify({ 
      userId: user._id.toString(),
      role: user.role 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      sameSite: "lax"
    })

    return response
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
