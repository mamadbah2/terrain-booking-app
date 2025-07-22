"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Field {
  id: string
  name: string
  location: string
  price: number
}

export default function ManualReservation() {
  const { user } = useAuth()
  const [field, setField] = useState<Field | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; available: boolean }>>([])
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    contactMethod: "phone" as "phone" | "email",
    phone: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [reservationCode, setReservationCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Récupérer le terrain géré par le gérant connecté
  useEffect(() => {
    const fetchManagedField = async () => {
      if (!user?.id) return

      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/terrains/gerant/${user.id}`, {
          method: "GET",
          credentials: "include",
        })

        const data = await response.json()

        if (response.ok && data.success && data.terrain) {
          setField({
            id: data.terrain.id,
            name: data.terrain.name,
            location: data.terrain.location,
            price: data.terrain.price
          })
        } else {
          setError("Aucun terrain assigné à ce gérant")
        }
      } catch (error) {
        console.error("Error fetching managed field:", error)
        setError("Erreur de connexion")
      } finally {
        setLoading(false)
      }
    }

    fetchManagedField()
  }, [user?.id])

  // Récupérer les disponibilités réelles depuis l'API
  const fetchAvailability = async (fieldId: string, date: string) => {
    if (!fieldId || !date) return

    setAvailabilityLoading(true)
    try {
      const response = await fetch(`/api/terrains/${fieldId}/disponibilites?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        if (data.availableSlots && data.availableSlots.length > 0) {
          setAvailableSlots(data.availableSlots)
        } else {
          setAvailableSlots([])
        }
      } else {
        setAvailableSlots([])
      }
    } catch (error) {
      console.error("Error fetching availability:", error)
      setAvailableSlots([])
    } finally {
      setAvailabilityLoading(false)
    }
  }

  useEffect(() => {
    if (field?.id && selectedDate) {
      fetchAvailability(field.id, selectedDate)
      setSelectedSlot("")
    }
  }, [field?.id, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!field || !selectedDate || !selectedSlot || !customerInfo.firstName || !customerInfo.lastName) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (customerInfo.contactMethod === "phone" && !customerInfo.phone) {
      setError("Veuillez entrer un numéro de téléphone")
      return
    }

    if (customerInfo.contactMethod === "email" && !customerInfo.email) {
      setError("Veuillez entrer une adresse email")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setError(null)

    try {
      const response = await fetch("/api/reservations/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          terrainId: field.id,
          date: selectedDate,
          timeSlot: selectedSlot,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          contactMethod: customerInfo.contactMethod,
          phone: customerInfo.phone,
          email: customerInfo.email,
          totalPrice: field.price,
          manualBooking: true,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setReservationCode(data.reservationCode)
        setSubmitStatus("success")

        // Reset form
        setSelectedDate("")
        setSelectedSlot("")
        setCustomerInfo({
          firstName: "",
          lastName: "",
          contactMethod: "phone",
          phone: "",
          email: "",
        })
        
        // Rafraîchir les disponibilités
        if (field.id && selectedDate) {
          fetchAvailability(field.id, selectedDate)
        }
      } else {
        setError(data.error || "Erreur lors de la réservation")
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error creating manual reservation:", error)
      setError("Erreur de connexion")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !field) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-red-600 mb-4">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-semibold">Aucun terrain assigné</p>
          <p>{error}</p>
        </div>
        <p className="text-gray-600">
          Vous devez avoir un terrain assigné pour créer des réservations manuelles.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {submitStatus === "success" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">Réservation créée avec succès!</h3>
                <p className="text-green-700">
                  Code de réservation: <span className="font-mono font-bold">{reservationCode}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && submitStatus === "error" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">Erreur lors de la réservation</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Créer une réservation manuelle</CardTitle>
          {field && (
            <p className="text-sm text-gray-600">
              Terrain: <span className="font-medium">{field.name}</span> - {field.location}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label htmlFor="date" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <Label className="flex items-center mb-3">
                  <Clock className="w-4 h-4 mr-2" />
                  Créneaux disponibles *
                </Label>
                {availabilityLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Vérification des disponibilités...</p>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && setSelectedSlot(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 rounded-md text-sm font-medium transition-colors ${
                          selectedSlot === slot.time
                            ? "bg-green-600 text-white"
                            : slot.available
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucun créneau disponible pour cette date</p>
                )}
              </div>
            )}

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations du client</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                    placeholder="Prénom du client"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                    placeholder="Nom du client"
                  />
                </div>
              </div>

              <div>
                <Label>Méthode de contact *</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={customerInfo.contactMethod === "phone"}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, contactMethod: e.target.value as "phone" })}
                      className="mr-2"
                    />
                    Téléphone
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={customerInfo.contactMethod === "email"}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, contactMethod: e.target.value as "email" })}
                      className="mr-2"
                    />
                    Email
                  </label>
                </div>
              </div>

              {customerInfo.contactMethod === "phone" ? (
                <div>
                  <Label htmlFor="phone">Numéro de téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="email">Adresse email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="client@email.com"
                  />
                </div>
              )}
            </div>

            {/* Price Summary */}
            {field && selectedSlot && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Résumé de la réservation</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Terrain: {field.name}</p>
                  <p>Date: {new Date(selectedDate).toLocaleDateString("fr-FR")}</p>
                  <p>Heure: {selectedSlot} (1 heure)</p>
                  <div className="border-t pt-2 mt-2">
                    <p className="font-medium text-gray-900">Total: {field.price.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !field || !selectedDate || !selectedSlot}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Création..." : "Créer la réservation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
