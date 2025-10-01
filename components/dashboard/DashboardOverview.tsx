"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, MapPin } from "lucide-react"
import RevenueChart from "./RevenueChart"
import PopularFields from "./PopularFields"

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalReservations: number
  reservationsChange: number
  activeFields: number
  fieldsChange: number
  averageBookingValue: number
  bookingValueChange: number
  revenueChartData?: Array<{
    date: string
    revenue: number
    reservations: number
  }>
  popularFields?: Array<{
    id: string
    name: string
    location: string
    reservations: number
    revenue: number
  }>
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/dashboard/stats', {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques')
        }

        const data = await response.json()

        console.log("Dashboard stats fetched:", data)
        
        if (data.success) {
          setStats(data.stats)
        } else {
          throw new Error(data.error || 'Erreur inconnue')
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setError(error instanceof Error ? error.message : 'Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = "number",
  }: {
    title: string
    value: number
    change: number
    icon: any
    format?: "number" | "currency"
  }) => {
    const isPositive = change >= 0
    const formattedValue = format === "currency" ? `${value.toLocaleString()} FCFA` : value.toLocaleString()

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <Icon className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formattedValue}</div>
          <div className={`flex items-center text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(change)}% vs mois dernier
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenus Total"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Réservations"
          value={stats.totalReservations}
          change={stats.reservationsChange}
          icon={Calendar}
        />
        <StatCard title="Terrains Actifs" value={stats.activeFields} change={stats.fieldsChange} icon={MapPin} />
        <StatCard
          title="Valeur Moyenne"
          value={stats.averageBookingValue}
          change={stats.bookingValueChange}
          icon={Users}
          format="currency"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <RevenueChart compact />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terrains Populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <PopularFields compact />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
