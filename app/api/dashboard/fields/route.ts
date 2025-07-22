import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock field performance data
    const mockFieldStats = [
      {
        id: "1",
        name: "TERRAIN PLACE DE L'OBELISQUE",
        location: "Fass, Dakar",
        image: "/placeholder.svg?height=100&width=150",
        sport: "Football",
        totalReservations: 89,
        totalRevenue: 2670000,
        utilizationRate: 85,
        averageRating: 4.8,
        trend: "up",
        trendPercentage: 12.5,
        monthlyData: [
          { month: "Jan", reservations: 15, revenue: 450000 },
          { month: "Fév", reservations: 18, revenue: 540000 },
          { month: "Mar", reservations: 22, revenue: 660000 },
          { month: "Avr", reservations: 19, revenue: 570000 },
          { month: "Mai", reservations: 15, revenue: 450000 },
        ],
      },
      {
        id: "2",
        name: "COURT DE TENNIS ALMADIES",
        location: "Almadies, Dakar",
        image: "/placeholder.svg?height=100&width=150",
        sport: "Tennis",
        totalReservations: 67,
        totalRevenue: 1675000,
        utilizationRate: 78,
        averageRating: 4.6,
        trend: "up",
        trendPercentage: 8.3,
        monthlyData: [
          { month: "Jan", reservations: 12, revenue: 300000 },
          { month: "Fév", reservations: 14, revenue: 350000 },
          { month: "Mar", reservations: 16, revenue: 400000 },
          { month: "Avr", reservations: 13, revenue: 325000 },
          { month: "Mai", reservations: 12, revenue: 300000 },
        ],
      },
      {
        id: "3",
        name: "TERRAIN BASKETBALL PARCELLES",
        location: "Parcelles Assainies, Dakar",
        image: "/placeholder.svg?height=100&width=150",
        sport: "Basketball",
        totalReservations: 45,
        totalRevenue: 900000,
        utilizationRate: 65,
        averageRating: 4.4,
        trend: "stable",
        trendPercentage: 0,
        monthlyData: [
          { month: "Jan", reservations: 8, revenue: 160000 },
          { month: "Fév", reservations: 9, revenue: 180000 },
          { month: "Mar", reservations: 10, revenue: 200000 },
          { month: "Avr", reservations: 9, revenue: 180000 },
          { month: "Mai", reservations: 9, revenue: 180000 },
        ],
      },
    ]

    // Sort by total reservations (most popular first)
    const sortedFields = mockFieldStats.sort((a, b) => b.totalReservations - a.totalReservations)

    return NextResponse.json({
      success: true,
      data: sortedFields,
      summary: {
        totalFields: sortedFields.length,
        totalReservations: sortedFields.reduce((sum, field) => sum + field.totalReservations, 0),
        totalRevenue: sortedFields.reduce((sum, field) => sum + field.totalRevenue, 0),
        averageUtilization: Math.round(
          sortedFields.reduce((sum, field) => sum + field.utilizationRate, 0) / sortedFields.length,
        ),
        averageRating: (
          sortedFields.reduce((sum, field) => sum + field.averageRating, 0) / sortedFields.length
        ).toFixed(1),
      },
    })
  } catch (error) {
    console.error("Error fetching field stats:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
