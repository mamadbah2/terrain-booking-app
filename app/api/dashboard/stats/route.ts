import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "monthly"

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock dashboard statistics
    const mockStats = {
      totalRevenue: 2450000,
      revenueChange: 12.5,
      totalReservations: 156,
      reservationsChange: 8.2,
      activeFields: 12,
      fieldsChange: 0,
      averageBookingValue: 28500,
      bookingValueChange: -2.1,
      topFields: [
        {
          id: "1",
          name: "TERRAIN PLACE DE L'OBELISQUE",
          reservations: 89,
          revenue: 2670000,
          utilizationRate: 85,
        },
        {
          id: "2",
          name: "COURT DE TENNIS ALMADIES",
          reservations: 67,
          revenue: 1675000,
          utilizationRate: 78,
        },
      ],
      recentActivity: [
        {
          id: "1",
          type: "new_reservation",
          message: "Nouvelle réservation - TERRAIN PLACE DE L'OBELISQUE",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "cancellation",
          message: "Réservation annulée - COURT DE TENNIS ALMADIES",
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: mockStats,
      period,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
