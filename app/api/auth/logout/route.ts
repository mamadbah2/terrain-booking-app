import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    })

    // Supprimer le cookie de session
    response.cookies.delete("session")

    return response
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
