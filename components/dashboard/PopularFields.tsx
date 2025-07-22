"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, Calendar, DollarSign } from "lucide-react"

interface PopularField {
  id: string
  name: string
  location: string
  reservations: number
  revenue: number
}

export default function PopularFields({ compact = false }: { compact?: boolean }) {
  const [fields, setFields] = useState<PopularField[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularFields = async () => {
      try {
        const response = await fetch('/api/dashboard/stats', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.stats.popularFields) {
            setFields(result.stats.popularFields)
          }
        }
      } catch (error) {
        console.error("Error fetching popular fields:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularFields()
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

  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Aucune donnée disponible ce mois</p>
      </div>
    )
  }

  const displayFields = compact ? fields.slice(0, 3) : fields

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terrains Populaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayFields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900">{field.name}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {field.location}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center text-sm font-medium text-green-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {field.revenue.toLocaleString()} FCFA
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {field.reservations} réservations
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
                    {fields.reduce((sum, field) => sum + field.reservations, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Total Réservations</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {fields.reduce((sum, field) => sum + field.revenue, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total Revenus (FCFA)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.round(fields.reduce((sum, field) => sum + field.reservations, 0) / fields.length)}%
                  </div>
                  <div className="text-xs text-gray-600">Utilisation Moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {(fields.reduce((sum, field) => sum + field.revenue, 0) / fields.length).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Revenu Moyen</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
