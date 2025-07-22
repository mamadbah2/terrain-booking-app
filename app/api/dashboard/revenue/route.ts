import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "monthly"

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock revenue data based on period
    let revenueData = []

    switch (period) {
      case "daily":
        revenueData = [
          { period: "Lun", revenue: 85000, reservations: 3 },
          { period: "Mar", revenue: 120000, reservations: 4 },
          { period: "Mer", revenue: 95000, reservations: 3 },
          { period: "Jeu", revenue: 140000, reservations: 5 },
          { period: "Ven", revenue: 180000, reservations: 6 },
          { period: "Sam", revenue: 220000, reservations: 8 },
          { period: "Dim", revenue: 160000, reservations: 5 },
        ]
        break
      case "weekly":
        revenueData = [
          { period: "S1", revenue: 680000, reservations: 24 },
          { period: "S2", revenue: 720000, reservations: 26 },
          { period: "S3", revenue: 650000, reservations: 22 },
          { period: "S4", revenue: 780000, reservations: 28 },
        ]
        break
      default: // monthly
        revenueData = [
          { period: "Jan", revenue: 1200000, reservations: 45 },
          { period: "Fév", revenue: 1350000, reservations: 52 },
          { period: "Mar", revenue: 1180000, reservations: 43 },
          { period: "Avr", revenue: 1420000, reservations: 58 },
          { period: "Mai", revenue: 1680000, reservations: 65 },
          { period: "Jun", revenue: 1850000, reservations: 72 },
          { period: "Jul", revenue: 2100000, reservations: 81 },
          { period: "Aoû", revenue: 1950000, reservations: 76 },
          { period: "Sep", revenue: 1720000, reservations: 68 },
          { period: "Oct", revenue: 1580000, reservations: 62 },
          { period: "Nov", revenue: 1450000, reservations: 56 },
          { period: "Déc", revenue: 1380000, reservations: 54 },
        ]
    }

    return NextResponse.json({
      success: true,
      data: revenueData,
      period,
      summary: {
        total: revenueData.reduce((sum, item) => sum + item.revenue, 0),
        totalReservations: revenueData.reduce((sum, item) => sum + item.reservations, 0),
        average: Math.round(revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length),
        growth:
          revenueData.length > 1
            ? Math.round(
                ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue) * 100,
              )
            : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
