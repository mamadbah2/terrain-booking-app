"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calendar, Clock, MapPin, User, Phone, Mail, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ReservationDetails {
  code: string
  terrainName: string
  terrainLocation: string
  terrainImage: string
  date: string
  timeSlot: string
  duration: number
  firstName: string
  lastName: string
  contactMethod: "phone" | "email"
  phone?: string
  email?: string
  totalPrice: number
  status: string
  createdAt: string
}

export default function FindReservationPage() {
  const [searchCode, setSearchCode] = useState("")
  const [searchContact, setSearchContact] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchCode.trim()) {
      setError("Veuillez entrer votre code de réservation")
      return
    }

    setIsSearching(true)
    setError("")
    setReservation(null)

    try {
      const response = await fetch(`/api/reservations/guest/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: searchCode.trim().toUpperCase(),
          contact: searchContact.trim(),
        }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Aucune réservation trouvée avec ce code")
        }
        throw new Error("Erreur lors de la recherche")
      }

      const data = await response.json()
      setReservation(data.reservation)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmé":
        return "bg-green-100 text-green-800 border-green-200"
      case "en attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "annulé":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Retrouver ma Réservation</h1>
        <p className="text-gray-600">Entrez votre code de réservation pour consulter les détails de votre booking</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Rechercher votre réservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="code">Code de réservation *</Label>
              <Input
                id="code"
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
                className="text-center text-lg font-mono tracking-wider"
                maxLength={6}
              />
            </div>

            <div>
              <Label htmlFor="contact">Téléphone ou Email (optionnel)</Label>
              <Input
                id="contact"
                type="text"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                placeholder="Votre téléphone ou email pour vérification"
              />
              <p className="text-sm text-gray-500 mt-1">Cette information aide à sécuriser votre recherche</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isSearching} className="w-full bg-green-600 hover:bg-green-700">
              {isSearching ? "Recherche..." : "Rechercher ma réservation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reservation Details */}
      {reservation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Détails de votre réservation</CardTitle>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reservation.status)}`}
              >
                {reservation.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Terrain Image */}
              <div className="lg:col-span-1">
                <Image
                  src={reservation.terrainImage || "/placeholder.svg"}
                  alt={reservation.terrainName}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* Reservation Info */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{reservation.terrainName}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {reservation.terrainLocation}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Heure:</span>
                      <span className="ml-2">
                        {reservation.timeSlot} ({reservation.duration}h)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Réservé par:</span>
                      <span className="ml-2">
                        {reservation.firstName} {reservation.lastName}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      {reservation.contactMethod === "phone" ? (
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      )}
                      <span className="font-medium">Contact:</span>
                      <span className="ml-2">
                        {reservation.contactMethod === "phone" ? reservation.phone : reservation.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Code:</span>
                      <span className="ml-2 font-mono text-lg text-green-600">{reservation.code}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Prix total:</span>
                      <span className="ml-2 text-lg font-bold text-green-600">
                        {reservation.totalPrice.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Réservation créée le {new Date(reservation.createdAt).toLocaleDateString("fr-FR")} à{" "}
                    {new Date(reservation.createdAt).toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Vous ne trouvez pas votre code de réservation ?</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Vérifiez vos SMS ou emails</p>
          <p>• Le code contient 6 caractères (lettres et chiffres)</p>
          <p>• Contactez-nous au +221 XX XXX XX XX pour assistance</p>
        </div>
      </div>
    </div>
  )
}
