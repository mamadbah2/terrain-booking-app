"use client"

import { useAuth } from "@/contexts/AuthContext"
import { redirect } from "next/navigation"
import DashboardOverview from "@/components/dashboard/DashboardOverview"
import RevenueChart from "@/components/dashboard/RevenueChart"
import PopularFields from "@/components/dashboard/PopularFields"
import ReservationSummary from "@/components/dashboard/ReservationSummary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "proprio") {
    redirect("/login")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
        <p className="text-gray-600">Vue d'ensemble de vos performances et revenus</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="fields">Terrains</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueChart />
        </TabsContent>

        <TabsContent value="fields">
          <PopularFields />
        </TabsContent>

        <TabsContent value="reservations">
          <ReservationSummary />
        </TabsContent>
      </Tabs>
    </div>
  )
}
