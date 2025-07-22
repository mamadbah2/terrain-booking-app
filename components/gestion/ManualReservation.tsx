"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface Field {
  id: string
  name: string
  location: string
  price: number
}

export default function ManualReservation() {
  const [fields, setFields] = useState<Field[]>([])
  const [selectedField, setSelectedField] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; available: boolean }>>([])
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

  // Mock fields data
  const mockFields: Field[] = [
    { id: "1", name: "TERRAIN PLACE DE L'OBELISQUE", location: "Fass, Dakar", price: 30000 },
    { id: "2", name: "COURT DE TENNIS ALMADIES", location: "Almadies, Dakar", price: 25000 },
  ]

  useEffect(() => {
    setFields(mockFields)
  }, [])

  const fetchAvailability = async (fieldId: string, date: string) => {
    if (!fieldId || !date) return

    try {
      // Mock availability data
      const mockSlots = [
        { time: "08:00", available: true },
        { time: "10:00", available: Math.random() > 0.3 },
        { time: "12:00", available: false },
        { time: "14:00", available: Math.random() > 0.2 },
        { time: "16:00", available: Math.random() > 0.4 },
        { time: "18:00", available: false },
        { time: "20:00", available: Math.random() > 0.5 },
      ]
      setAvailableSlots(mockSlots)
    } catch (error) {
      console.error("Error fetching availability:", error)
    }
  }

  useEffect(() => {
    if (selectedField && selectedDate) {
      fetchAvailability(selectedField, selectedDate)
      setSelectedSlot("")
    }
  }, [selectedField, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedField || !selectedDate || !selectedSlot || !customerInfo.firstName || !customerInfo.lastName) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (customerInfo.contactMethod === "phone" && !customerInfo.phone) {
      alert("Veuillez entrer un numéro de téléphone")
      return
    }

    if (customerInfo.contactMethod === "email" && !customerInfo.email) {
      alert("Veuillez entrer une adresse email")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/reservations/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          terrainId: selectedField,
          date: selectedDate,
          timeSlot: selectedSlot,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          contactMethod: customerInfo.contactMethod,
          phone: customerInfo.phone,
          email: customerInfo.email,
          manualBooking: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la réservation")
      }

      const result = await response.json()
      setReservationCode(result.reservationCode)
      setSubmitStatus("success")

      // Reset form
      setSelectedField("")
      setSelectedDate("")
      setSelectedSlot("")
      setCustomerInfo({
        firstName: "",
        lastName: "",
        contactMethod: "phone",
        phone: "",
        email: "",
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedFieldData = fields.find((field) => field.id === selectedField)

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

      {submitStatus === "error" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">Erreur lors de la réservation</h3>
                <p className="text-red-700">Veuillez réessayer ou contacter le support technique.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Créer une réservation manuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field Selection */}
            <div>
              <Label htmlFor="field">Terrain *</Label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un terrain" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name} - {field.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
            {availableSlots.length > 0 && (
              <div>
                <Label className="flex items-center mb-3">
                  <Clock className="w-4 h-4 mr-2" />
                  Créneaux disponibles *
                </Label>
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
            {selectedFieldData && selectedSlot && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Résumé de la réservation</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Terrain: {selectedFieldData.name}</p>
                  <p>Date: {new Date(selectedDate).toLocaleDateString("fr-FR")}</p>
                  <p>Heure: {selectedSlot} (1 heure)</p>
                  <div className="border-t pt-2 mt-2">
                    <p className="font-medium text-gray-900">Total: {selectedFieldData.price.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !selectedField || !selectedDate || !selectedSlot}
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
