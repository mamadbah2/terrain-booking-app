"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, TrendingUp, Calendar, DollarSign } from "lucide-react"
import Image from "next/image"

interface FieldStats {
  id: string
  name: string
  location: string
  image: string
  sport: string
  totalReservations: number
  totalRevenue: number
  utilizationRate: number
  averageRating: number
  trend: "up" | "down" | "stable"
  trendPercentage: number
}

interface PopularFieldsProps {
  compact?: boolean
}

export default function PopularFields({ compact = false }: PopularFieldsProps) {
  const [fields, setFields] = useState<FieldStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFieldStats = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock data
        const mockFields: FieldStats[] = [
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
          },
          {
            id: "4",
            name: "TERRAIN VOLLEYBALL YOFF",
            location: "Yoff, Dakar",
            image: "/placeholder.svg?height=100&width=150",
            sport: "Volleyball",
            totalReservations: 32,
            totalRevenue: 480000,
            utilizationRate: 52,
            averageRating: 4.2,
            trend: "down",
            trendPercentage: -5.2,
          },
          {
            id: "5",
            name: "TERRAIN HANDBALL GUEDIAWAYE",
            location: "Guédiawaye, Dakar",
            image: "/placeholder.svg?height=100&width=150",
            sport: "Handball",
            totalReservations: 28,
            totalRevenue: 504000,
            utilizationRate: 48,
            averageRating: 4.1,
            trend: "up",
            trendPercentage: 3.7,
          },
        ]

        setFields(mockFields.sort((a, b) => b.totalReservations - a.totalReservations))
      } catch (error) {
        console.error("Error fetching field stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFieldStats()
  }, [])

  if (loading) {
    return (
      <Card className={compact ? "border-0 shadow-none" : ""}>
        {!compact && (
          <CardHeader>
            <CardTitle>Terrains Populaires</CardTitle>
          </CardHeader>
        )}
        <CardContent className={compact ? "p-0" : ""}>
          <div className="space-y-4">
            {[...Array(compact ? 3 : 5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-24 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayFields = compact ? fields.slice(0, 3) : fields

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const content = (
    <div className="space-y-4">
      {displayFields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="relative">
              <Image
                src={field.image || "/placeholder.svg"}
                alt={field.name}
                width={80}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="absolute -top-2 -left-2 bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{field.name}</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {field.sport}
              </Badge>
            </div>

            <div className="flex items-center text-xs text-gray-600 mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {field.location}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center text-xs">
                <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                <span className="font-medium">{field.totalReservations}</span>
                <span className="text-gray-500 ml-1">réservations</span>
              </div>
              <div className="flex items-center text-xs">
                <DollarSign className="h-3 w-3 mr-1 text-gray-500" />
                <span className="font-medium">{field.totalRevenue.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">FCFA</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Taux d'utilisation</span>
                <span className="font-medium">{field.utilizationRate}%</span>
              </div>
              <Progress value={field.utilizationRate} className="h-2" />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs">
                <span className="text-gray-600">Note:</span>
                <span className="font-medium ml-1">{field.averageRating}/5</span>
                <div className="flex ml-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < Math.floor(field.averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className={`flex items-center text-xs ${getTrendColor(field.trend)}`}>
                {getTrendIcon(field.trend)}
                <span className="ml-1">
                  {field.trendPercentage !== 0 && (
                    <>
                      {field.trendPercentage > 0 ? "+" : ""}
                      {field.trendPercentage}%
                    </>
                  )}
                  {field.trendPercentage === 0 && "Stable"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {!compact && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Statistiques Globales</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {fields.reduce((sum, field) => sum + field.totalReservations, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Réservations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {fields.reduce((sum, field) => sum + field.totalRevenue, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Revenus (FCFA)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(fields.reduce((sum, field) => sum + field.utilizationRate, 0) / fields.length)}%
              </div>
              <div className="text-xs text-gray-600">Utilisation Moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {(fields.reduce((sum, field) => sum + field.averageRating, 0) / fields.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Note Moyenne</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (compact) {
    return content
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terrains Populaires</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
