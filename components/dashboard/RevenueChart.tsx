"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart } from "recharts"
import { Eye, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RevenueData {
  date: string
  revenue: number
  reservations: number
}

interface RevenueChartProps {
  compact?: boolean
}

export default function RevenueChart({ compact = false }: RevenueChartProps) {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("monthly")
  const [chartType, setChartType] = useState("bar")
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/dashboard/stats', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.stats.revenueChartData) {
            setData(result.stats.revenueChartData)
          }
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  if (loading) {
    return (
      <Card className={compact ? "border-0 shadow-none" : ""}>
        {!compact && (
          <CardHeader>
            <CardTitle>Évolution des Revenus</CardTitle>
          </CardHeader>
        )}
        <CardContent className={compact ? "p-0" : ""}>
          <div className="animate-pulse">
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    revenue: {
      label: "Revenus (FCFA)",
      color: "hsl(var(--chart-1))",
    },
    reservations: {
      label: "Réservations",
      color: "hsl(var(--chart-2))",
    },
  }

  const ChartComponent = chartType === "bar" ? LineChart : Line
  const DataComponent = chartType === "bar" ? BarChart : Line

  const DetailModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Voir détails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Détails des Revenus - {period === "daily" ? "Quotidien" : period === "weekly" ? "Hebdomadaire" : "Mensuel"}
          </DialogTitle>
          <DialogDescription>Données détaillées des revenus et réservations par période</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Total Revenus (FCFA)</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.reduce((sum, item) => sum + item.reservations, 0)}
              </div>
              <div className="text-sm text-blue-700">Total Réservations</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Moyenne (FCFA)</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {data.length > 1
                  ? Math.round(((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-orange-700">Croissance</div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Données détaillées</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenus (FCFA)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réservations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenu Moyen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Évolution
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => {
                    const avgRevenue = item.reservations > 0 ? Math.round(item.revenue / item.reservations) : 0
                    const prevRevenue = index > 0 ? data[index - 1].revenue : item.revenue
                    const growth = prevRevenue > 0 ? Math.round(((item.revenue - prevRevenue) / prevRevenue) * 100) : 0

                    return (
                      <tr key={item.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.revenue.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reservations}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {avgRevenue.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {index === 0 ? (
                            <span className="text-gray-500">-</span>
                          ) : (
                            <div className={`flex items-center ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                              <TrendingUp className={`w-4 h-4 mr-1 ${growth < 0 ? "rotate-180" : ""}`} />
                              {growth >= 0 ? "+" : ""}
                              {growth}%
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Meilleures Performances</h4>
              <div className="space-y-2">
                {data
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={item.date} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        <span className="font-medium">{item.date}</span>
                      </div>
                      <span className="text-green-600 font-semibold">{item.revenue.toLocaleString()} FCFA</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Plus de Réservations</h4>
              <div className="space-y-2">
                {data
                  .sort((a, b) => b.reservations - a.reservations)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={item.date} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        <span className="font-medium">{item.date}</span>
                      </div>
                      <span className="text-blue-600 font-semibold">{item.reservations} réservations</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const content = (
    <div className="space-y-4">
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type de graphique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Barres</SelectItem>
                <SelectItem value="line">Lignes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DetailModal />
        </div>
      )}

      <ChartContainer config={chartConfig} className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, name) => [
                name === "revenue" ? `${Number(value).toLocaleString()} FCFA` : value,
                name === "revenue" ? "Revenus" : "Réservations",
              ]}
            />
            <DataComponent
              type={chartType === "line" ? "monotone" : undefined}
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              strokeWidth={chartType === "line" ? 2 : undefined}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total FCFA</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.reservations, 0)}
          </div>
          <div className="text-sm text-gray-600">Réservations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Moyenne FCFA</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data.length > 1
              ? Math.round(((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Croissance</div>
        </div>
      </div>

      {compact && (
        <div className="flex justify-center pt-4">
          <DetailModal />
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
        <CardTitle>Évolution des Revenus</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
