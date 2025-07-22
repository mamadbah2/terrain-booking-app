"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, Phone, Mail, AlertCircle, CheckCircle, Copy, Home, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface GuestBookingModalProps {
  isOpen: boolean
  onClose: () => void
  field: {
    id: string
    name: string
    price: number
  }
  selectedDate: string
  selectedSlot: string
}

interface FormData {
  firstName: string
  lastName: string
  contactMethod: "phone" | "email"
  phone: string
  email: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
}

export default function GuestBookingModal({
  isOpen,
  onClose,
  field,
  selectedDate,
  selectedSlot,
}: GuestBookingModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    contactMethod: "phone",
    phone: "",
    email: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")
  const [reservationCode, setReservationCode] = useState("")

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        contactMethod: "phone",
        phone: "",
        email: "",
      })
      setErrors({})
      setSubmitStatus("idle")
      setSubmitMessage("")
      setReservationCode("")
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis"
    }

    if (formData.contactMethod === "phone") {
      if (!formData.phone.trim()) {
        newErrors.phone = "Le numéro de téléphone est requis"
      } else if (!/^(\+221|00221)?[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Format de téléphone invalide (ex: +221 XX XXX XX XX)"
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = "L'adresse email est requise"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Format d'email invalide"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const generateReservationCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/reservations/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          terrainId: field.id,
          date: selectedDate,
          timeSlot: selectedSlot,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactMethod: formData.contactMethod,
          phone: formData.phone,
          email: formData.email,
          totalPrice: field.price,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la réservation")
      }

      const result = await response.json()

      setReservationCode(result.reservationCode)
      setSubmitStatus("success")
      setSubmitMessage("Réservation confirmée avec succès!")
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Erreur lors de la réservation. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reservationCode)
      alert("Code copié dans le presse-papiers!")
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{submitStatus === "success" ? "Réservation Confirmée!" : "Réserver le terrain"}</DialogTitle>
          <DialogDescription>
            {submitStatus === "success"
              ? "Votre réservation a été confirmée avec succès."
              : "Veuillez remplir vos informations pour finaliser la réservation."}
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />

            {/* Reservation Code Display */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Votre code de réservation</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl font-bold text-green-600 tracking-wider">{reservationCode}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-green-600 hover:text-green-700"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-green-700">
                Ce code a été envoyé à votre{" "}
                {formData.contactMethod === "phone" ? "numéro de téléphone" : "adresse email"}
              </p>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h4 className="font-semibold text-gray-900 mb-3">Détails de votre réservation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{selectedSlot} (1 heure)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-green-600">{field.price.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-sm">
              Conservez précieusement ce code pour retrouver votre réservation ou la modifier si nécessaire.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 flex items-center justify-center" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Retourner à l'accueil
                </Link>
              </Button>
              <Button className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700" asChild>
                <Link href="/retrouver-reservation">
                  <Search className="w-4 h-4 mr-2" />
                  Retrouver ma réservation
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Résumé de la réservation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{selectedSlot} (1 heure)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-green-600">{field.price.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">{submitMessage}</span>
                </div>
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Prénom *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName" className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Nom *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Contact Method Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Méthode de contact préférée *</Label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={formData.contactMethod === "phone"}
                      onChange={(e) => handleInputChange("contactMethod", e.target.value)}
                      className="mr-2"
                    />
                    <Phone className="w-4 h-4 mr-1" />
                    Téléphone
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={formData.contactMethod === "email"}
                      onChange={(e) => handleInputChange("contactMethod", e.target.value)}
                      className="mr-2"
                    />
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </label>
                </div>
              </div>

              {/* Contact Information */}
              {formData.contactMethod === "phone" ? (
                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Numéro de téléphone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                    placeholder="+221 XX XXX XX XX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              ) : (
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Adresse email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
                  {isSubmitting ? "Réservation..." : "Confirmer la réservation"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
