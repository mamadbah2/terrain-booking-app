"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import GuestBookingModal from "./GuestBookingModal"

interface BookingSectionProps {
  field: {
    id: string
    name: string
    price: number
  }
}

export default function BookingSection({ field }: BookingSectionProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<Array<{time: string, available: boolean}>>([])


  const fetchAvailability = async (date: string) => {
    if (!date) return

    setAvailabilityLoading(true)
    try {
      const response = await fetch(`/api/terrains/${field.id}/disponibilites?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        // Si l'API renvoie des créneaux, utilisez-les
        if (data.availableSlots && data.availableSlots.length > 0) {
          setAvailableSlots(data.availableSlots)
        } else {
          // Sinon, générez des créneaux par défaut pour la démo
          const defaultSlots = generateDefaultTimeSlots(date)
          setAvailableSlots(defaultSlots)
        }
      } 
    } catch (error) {
      console.error("Error fetching availability:", error)
      // En cas d'erreur, générer des créneaux par défaut
      const defaultSlots = generateDefaultTimeSlots(date)
      setAvailableSlots(defaultSlots)
    } finally {
      setAvailabilityLoading(false)
    }
  }

  // Fonction pour générer des créneaux horaires par défaut (pour la démo)
  const generateDefaultTimeSlots = (date: string): Array<{time: string, available: boolean}> => {
    const selectedDay = new Date(date).getDay(); // 0 pour dimanche, 1 pour lundi, etc.
    const slots = [
      { time: "08:00", available: Math.random() > 0.3 },
      { time: "10:00", available: Math.random() > 0.3 },
      { time: "12:00", available: Math.random() > 0.4 },
      { time: "14:00", available: Math.random() > 0.2 },
      { time: "16:00", available: Math.random() > 0.5 },
      { time: "18:00", available: Math.random() > 0.6 },
      { time: "20:00", available: Math.random() > 0.4 },
    ];

    // Week-end avec moins de disponibilités
    if (selectedDay === 0 || selectedDay === 6) {
      return slots.map(slot => ({ ...slot, available: Math.random() > 0.6 }));
    }

    return slots;
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot("")
    fetchAvailability(date)
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) {
      alert("Veuillez sélectionner une date et un créneau")
      return
    }

    // In a real app, this would make an API call to create the booking
    alert(`Réservation confirmée pour le ${selectedDate} à ${selectedSlot}`)
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Réservation</span>
          <span className="text-2xl font-bold text-green-600">{field.price.toLocaleString()} FCFA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            Sélectionner une date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Time Slots */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Clock className="w-4 h-4 mr-2" />
            Créneaux disponibles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availabilityLoading ? (
              <div className="col-span-2 text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Vérification des disponibilités...</p>
              </div>
            ) : selectedDate ? (
              availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <button
                    key={slot.time}
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
                ))
              ) : (
                <div className="col-span-2 text-center py-4">
                  <p className="text-sm text-gray-500">Sélectionnez une date pour voir les disponibilités</p>
                </div>
              )
            ) : (
              <div className="col-span-2 text-center py-4">
                <p className="text-sm text-gray-500">Sélectionnez une date pour voir les disponibilités</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Summary */}
        {selectedDate && selectedSlot && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Résumé de la réservation</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Date: {new Date(selectedDate).toLocaleDateString("fr-FR")}</p>
              <p>Heure: {selectedSlot}</p>
              <p>Durée: 1 heure</p>
              <div className="border-t pt-2 mt-2">
                <p className="font-medium text-gray-900">Total: {field.price.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedDate || !selectedSlot}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          size="lg"
        >
          Réserver le terrain
        </Button>

        <GuestBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          field={field}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-600">
          <p>Besoin d'aide ?</p>
          <p className="text-green-600 font-medium">Contactez-nous au +221 XX XXX XX XX</p>
        </div>
      </CardContent>
    </Card>
  )
}
