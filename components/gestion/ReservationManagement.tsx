"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Reservation {
  id: string
  code: string
  terrainName: string
  terrainLocation: string
  date: string
  timeSlot: string
  duration: number
  firstName: string
  lastName: string
  contactMethod: "phone" | "email"
  phone?: string
  email?: string
  totalPrice: number
  status: "En attente" | "Confirmé" | "Payé" | "Utilisé" | "Annulé"
  createdAt: string
}

export default function ReservationManagement() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.id) return

      setLoading(true)
      setError(null)

      try {
        // Construire les paramètres de requête
        const params = new URLSearchParams({
          page: "1",
          limit: "50",
        })

        if (statusFilter !== "all") {
          params.append("status", statusFilter)
        }
        if (dateFilter) {
          params.append("date", dateFilter)
        }
        if (searchQuery) {
          params.append("search", searchQuery)
        }

        const response = await fetch(`/api/reservations/gerant/${user.id}?${params.toString()}`, {
          method: "GET",
          credentials: "include",
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setReservations(data.reservations)
          setFilteredReservations(data.reservations)
        } else {
          setError(data.error || "Erreur lors de la récupération des réservations")
        }
      } catch (error) {
        console.error("Error fetching reservations:", error)
        setError("Erreur de connexion")
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [user?.id, statusFilter, dateFilter, searchQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-green-100 text-green-800 border-green-200"
      case "En attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Payé":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Utilisé":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Annulé":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Mettre à jour l'état local
        setReservations(
          reservations.map((reservation) =>
            reservation.id === reservationId ? { ...reservation, status: newStatus as any } : reservation,
          ),
        )
        setFilteredReservations(
          filteredReservations.map((reservation) =>
            reservation.id === reservationId ? { ...reservation, status: newStatus as any } : reservation,
          ),
        )
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la mise à jour du statut")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      setError("Erreur de connexion")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Erreur</p>
          <p>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button
            onClick={() => setError(null)}
            variant="ghost"
            size="sm"
            className="mt-2 text-red-600 hover:text-red-700"
          >
            Fermer
          </Button>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Code, nom, terrain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Confirmé">Confirmé</SelectItem>
                <SelectItem value="Payé">Payé</SelectItem>
                <SelectItem value="Utilisé">Utilisé</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>

            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} placeholder="Date" />

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setDateFilter("")
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(reservation.status)} font-medium`}>{reservation.status}</Badge>
                    <span className="font-mono text-lg font-bold text-green-600">{reservation.code}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="font-medium">{reservation.terrainName}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(reservation.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {reservation.timeSlot} ({reservation.duration}h)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>
                          {reservation.firstName} {reservation.lastName}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        {reservation.contactMethod === "phone" ? (
                          <Phone className="w-4 h-4 mr-2" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2" />
                        )}
                        <span>{reservation.contactMethod === "phone" ? reservation.phone : reservation.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="font-medium">{reservation.totalPrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="grid grid-cols-2 gap-2">
                    {reservation.status === "En attente" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(reservation.id, "Confirmé")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirmer
                      </Button>
                    )}
                    {reservation.status === "Confirmé" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(reservation.id, "Payé")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Payé
                      </Button>
                    )}
                    {reservation.status === "Payé" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(reservation.id, "Utilisé")}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Utilisé
                      </Button>
                    )}
                    {["En attente", "Confirmé"].includes(reservation.status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(reservation.id, "Annulé")}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReservations.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation trouvée</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== "all" || dateFilter
              ? "Aucune réservation ne correspond à vos critères."
              : "Aucune réservation pour le moment."}
          </p>
        </div>
      )}
    </div>
  )
}
