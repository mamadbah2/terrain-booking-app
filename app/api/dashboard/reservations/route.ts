import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "week"

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock reservation statistics
    const reservationStats = {
      total: 234,
      confirmed: 189,
      pending: 23,
      cancelled: 12,
      completed: 156,
      upcoming: 33,
      todayReservations: 8,
      weeklyTrend: 15.3,
    }

    // Mock trend data based on period
    let trendData = []
    if (period === "week") {
      trendData = [
        { date: "Lun", reservations: 12, revenue: 360000 },
        { date: "Mar", reservations: 15, revenue: 450000 },
        { date: "Mer", reservations: 8, revenue: 240000 },
        { date: "Jeu", reservations: 18, revenue: 540000 },
        { date: "Ven", reservations: 22, revenue: 660000 },
        { date: "Sam", reservations: 28, revenue: 840000 },
        { date: "Dim", reservations: 19, revenue: 570000 },
      ]
    } else {
      trendData = [
        { date: "S1", reservations: 45, revenue: 1350000 },
        { date: "S2", reservations: 52, revenue: 1560000 },
        { date: "S3", reservations: 48, revenue: 1440000 },
        { date: "S4", reservations: 56, revenue: 1680000 },
      ]
    }

    // Mock recent activity
    const recentActivity = [
      {
        id: "1",
        time: "Il y a 5 min",
        action: "Nouvelle réservation",
        details: "TERRAIN PLACE DE L'OBELISQUE - 14:00",
        status: "confirmed",
      },
      {
        id: "2",
        time: "Il y a 12 min",
        action: "Réservation annulée",
        details: "COURT DE TENNIS ALMADIES - 16:00",
        status: "cancelled",
      },
      {
        id: "3",
        time: "Il y a 25 min",
        action: "Paiement reçu",
        details: "TERRAIN BASKETBALL PARCELLES - 30,000 FCFA",
        status: "paid",
      },
      {
        id: "4",
        time: "Il y a 1h",
        action: "Réservation confirmée",
        details: "TERRAIN VOLLEYBALL YOFF - 10:00",
        status: "confirmed",
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        stats: reservationStats,
        trends: trendData,
        recentActivity,
      },
      period,
    })
  } catch (error) {
    console.error("Error fetching reservation data:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
