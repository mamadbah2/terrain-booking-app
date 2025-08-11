"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, TrendingUp, Users, XCircle, CheckCircle, AlertCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface ReservationStats {
  pending: number
  confirmed: number
  paid: number
  completed: number
  cancelled: number
  todayReservations: number
}

interface ReservationTrend {
  date: string
  reservations: number
  revenue: number
}

export default function ReservationSummary() {
  const [stats, setStats] = useState<ReservationStats | null>(null)
  const [trends, setTrends] = useState<ReservationTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("week")

  useEffect(() => {
    const fetchReservationData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/dashboard/stats', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setStats(result.stats.reservationStats)
            setTrends(result.stats.weeklyTrends || [])
          }
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReservationData()
  }, [period])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  // Pie chart data for reservation status
  const pieData = [
    { name: "Confirmées", value: stats.confirmed, color: "#10B981" },
    { name: "En attente", value: stats.pending, color: "#F59E0B" },
    { name: "Annulées", value: stats.cancelled, color: "#EF4444" },
  ]

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(stats.pending + stats.confirmed + stats.paid + stats.completed + stats.cancelled)}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />{stats.confirmed + stats.paid} confirmées
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.todayReservations}</div>
            <div className="text-sm text-gray-600">réservations prévues</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">À venir</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.confirmed + stats.paid}</div>
            <div className="text-sm text-gray-600">prochaines réservations</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            <div className="text-sm text-gray-600">ce mois-ci</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  confirmed: { label: "Confirmées", color: "#10B981" },
                  pending: { label: "En attente", color: "#F59E0B" },
                  cancelled: { label: "Annulées", color: "#EF4444" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium">Confirmées</span>
                </div>
                <div className="text-lg font-bold text-green-600">{stats.confirmed}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
                  <span className="text-sm font-medium">En attente</span>
                </div>
                <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <XCircle className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-sm font-medium">Annulées</span>
                </div>
                <div className="text-lg font-bold text-red-600">{stats.cancelled}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tendance Hebdomadaire</CardTitle>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  reservations: { label: "Réservations", color: "hsl(var(--chart-1))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reservations" fill="var(--color-reservations)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: "Il y a 5 min",
                action: "Nouvelle réservation",
                details: "TERRAIN PLACE DE L'OBELISQUE - 14:00",
                status: "confirmed",
              },
              {
                time: "Il y a 12 min",
                action: "Réservation annulée",
                details: "COURT DE TENNIS ALMADIES - 16:00",
                status: "cancelled",
              },
              {
                time: "Il y a 25 min",
                action: "Paiement reçu",
                details: "TERRAIN BASKETBALL PARCELLES - 30,000 FCFA",
                status: "paid",
              },
              {
                time: "Il y a 1h",
                action: "Réservation confirmée",
                details: "TERRAIN VOLLEYBALL YOFF - 10:00",
                status: "confirmed",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {activity.status === "confirmed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {activity.status === "cancelled" && <XCircle className="h-5 w-5 text-red-600" />}
                  {activity.status === "paid" && <Calendar className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
