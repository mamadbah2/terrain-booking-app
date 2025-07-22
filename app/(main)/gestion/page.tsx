"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { redirect } from "next/navigation"
import FieldManagement from "@/components/gestion/FieldManagement"
import ReservationManagement from "@/components/gestion/ReservationManagement"
import ManualReservation from "@/components/gestion/ManualReservation"

export default function GestionPage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "gerant") {
    redirect("/login")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Terrains</h1>
        <p className="text-gray-600">Gérez vos terrains et réservations</p>
      </div>

      <Tabs defaultValue="fields" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fields">Mon Terrain</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="manual">Réservation Manuelle</TabsTrigger>
        </TabsList>

        <TabsContent value="fields">
          <FieldManagement />
        </TabsContent>

        <TabsContent value="reservations">
          <ReservationManagement />
        </TabsContent>

        <TabsContent value="manual">
          <ManualReservation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
