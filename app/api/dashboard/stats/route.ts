import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session pour identifier l'utilisateur
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

    const client = await clientPromise
    const db = client.db("terrainBooking")

    // Récupérer l'utilisateur pour vérifier son rôle
    const user = await db.collection("users").findOne({ 
      _id: new ObjectId(sessionData.userId) 
    })

    if (!user || !["proprio", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Calculer les dates pour les comparaisons
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Filtre pour les terrains du propriétaire (si pas admin)
    const terrainFilter = user.role === "proprio" ? { ownerId: user._id } : {}

    // 1. Récupérer tous les terrains du propriétaire
    const userTerrains = await db.collection("terrains").find(terrainFilter).toArray()
    const terrainIds = userTerrains.map(t => t._id)

    // 2. Calculer les revenus du mois actuel
    const currentMonthReservations = await db.collection("reservations").find({
      fieldId: { $in: terrainIds },
      bookedAt: { 
        $gte: currentMonth.toISOString(),
        $lt: nextMonth.toISOString()
      },
      status: { $in: ["confirmed", "paid", "completed"] }
    }).toArray()

    const totalRevenue = currentMonthReservations.reduce((sum, res) => sum + res.totalPrice, 0)

    // 3. Calculer les revenus du mois dernier pour comparaison
    const lastMonthReservations = await db.collection("reservations").find({
      fieldId: { $in: terrainIds },
      bookedAt: { 
        $gte: lastMonth.toISOString(),
        $lt: currentMonth.toISOString()
      },
      status: { $in: ["confirmed", "paid", "completed"] }
    }).toArray()

    const lastMonthRevenue = lastMonthReservations.reduce((sum, res) => sum + res.totalPrice, 0)
    const revenueChange = lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    // 4. Calculer le nombre de réservations
    const totalReservations = currentMonthReservations.length
    const lastMonthReservationsCount = lastMonthReservations.length
    const reservationsChange = lastMonthReservationsCount > 0 ? 
      ((totalReservations - lastMonthReservationsCount) / lastMonthReservationsCount) * 100 : 0

    // 5. Calculer les terrains actifs (qui ont eu au moins une réservation ce mois)
    const activeFieldIds = new Set(currentMonthReservations.map(res => res.fieldId.toString()))
    const activeFields = activeFieldIds.size

    const lastMonthActiveFieldIds = new Set(lastMonthReservations.map(res => res.fieldId.toString()))
    const lastMonthActiveFields = lastMonthActiveFieldIds.size
    const fieldsChange = lastMonthActiveFields > 0 ? 
      ((activeFields - lastMonthActiveFields) / lastMonthActiveFields) * 100 : 0

    // 6. Calculer la valeur moyenne des réservations
    const averageBookingValue = totalReservations > 0 ? totalRevenue / totalReservations : 0
    const lastMonthAverageBookingValue = lastMonthReservationsCount > 0 ? 
      lastMonthRevenue / lastMonthReservationsCount : 0
    const bookingValueChange = lastMonthAverageBookingValue > 0 ? 
      ((averageBookingValue - lastMonthAverageBookingValue) / lastMonthAverageBookingValue) * 100 : 0

    // 7. Données pour le graphique des revenus (7 derniers jours)
    const revenueChartData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const dayReservations = await db.collection("reservations").find({
        fieldId: { $in: terrainIds },
        bookedAt: { 
          $gte: dayStart.toISOString(),
          $lt: dayEnd.toISOString()
        },
        status: { $in: ["confirmed", "paid", "completed"] }
      }).toArray()

      const dayRevenue = dayReservations.reduce((sum, res) => sum + res.totalPrice, 0)
      
      revenueChartData.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: dayRevenue,
        reservations: dayReservations.length
      })
    }

    // 8. Terrains les plus populaires
    const terrainReservationCounts = new Map()
    currentMonthReservations.forEach(res => {
      const terrainId = res.fieldId.toString()
      terrainReservationCounts.set(terrainId, (terrainReservationCounts.get(terrainId) || 0) + 1)
    })

    const popularFields = await Promise.all(
      Array.from(terrainReservationCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(async ([terrainId, count]) => {
          const terrain = userTerrains.find(t => t._id.toString() === terrainId)
          return {
            id: terrainId,
            name: terrain?.name || "Terrain inconnu",
            location: terrain?.location || "",
            reservations: count,
            revenue: currentMonthReservations
              .filter(res => res.fieldId.toString() === terrainId)
              .reduce((sum, res) => sum + res.totalPrice, 0)
          }
        })
    )

    const stats = {
      totalRevenue: Math.round(totalRevenue),
      revenueChange: Math.round(revenueChange * 100) / 100,
      totalReservations,
      reservationsChange: Math.round(reservationsChange * 100) / 100,
      activeFields,
      fieldsChange: Math.round(fieldsChange * 100) / 100,
      averageBookingValue: Math.round(averageBookingValue),
      bookingValueChange: Math.round(bookingValueChange * 100) / 100,
      revenueChartData,
      popularFields
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
