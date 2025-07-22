"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X } from "lucide-react"

interface Field {
  id: string
  name: string
  description: string
  location: string
  price: number
  sport: string
  surface: string
  capacity: string
  images: string[]
  operatingHours: {
    start: string
    end: string
  }
  status: "active" | "inactive"
}

interface FieldFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (field: Partial<Field>) => void
  field?: Field | null
}

export default function FieldForm({ isOpen, onClose, onSubmit, field }: FieldFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    sport: "",
    surface: "",
    capacity: "",
    operatingStart: "08:00",
    operatingEnd: "22:00",
    status: "active" as "active" | "inactive",
  })
  const [images, setImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const sports = ["Football", "Basketball", "Tennis", "Volleyball", "Handball", "Badminton"]
  const surfaces = ["Gazon naturel", "Gazon synthétique", "Béton", "Parquet", "Sable", "Terre battue"]

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name,
        description: field.description,
        location: field.location,
        price: field.price.toString(),
        sport: field.sport,
        surface: field.surface,
        capacity: field.capacity,
        operatingStart: field.operatingHours.start,
        operatingEnd: field.operatingHours.end,
        status: field.status,
      })
      setImages(field.images)
    } else {
      setFormData({
        name: "",
        description: "",
        location: "",
        price: "",
        sport: "",
        surface: "",
        capacity: "",
        operatingStart: "08:00",
        operatingEnd: "22:00",
        status: "active",
      })
      setImages([])
    }
    setErrors({})
  }, [field, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Le nom est requis"
    if (!formData.description.trim()) newErrors.description = "La description est requise"
    if (!formData.location.trim()) newErrors.location = "La localisation est requise"
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Le prix doit être un nombre positif"
    }
    if (!formData.sport) newErrors.sport = "Le type de sport est requis"
    if (!formData.surface) newErrors.surface = "Le type de surface est requis"
    if (!formData.capacity.trim()) newErrors.capacity = "La capacité est requise"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const fieldData: Partial<Field> = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      price: Number(formData.price),
      sport: formData.sport,
      surface: formData.surface,
      capacity: formData.capacity,
      images,
      operatingHours: {
        start: formData.operatingStart,
        end: formData.operatingEnd,
      },
      status: formData.status,
    }

    onSubmit(fieldData)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real app, you would upload these files to a server
      // For now, we'll just use placeholder URLs
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=200&width=300&text=${file.name}`,
      )
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{field ? "Modifier le terrain" : "Ajouter un nouveau terrain"}</DialogTitle>
          <DialogDescription>
            {field ? "Modifiez les informations du terrain." : "Remplissez les informations du nouveau terrain."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du terrain *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={errors.location ? "border-red-500" : ""}
                placeholder="Ex: Fass, Dakar"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sport">Type de sport *</Label>
              <Select value={formData.sport} onValueChange={(value) => setFormData({ ...formData, sport: value })}>
                <SelectTrigger className={errors.sport ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sport && <p className="text-red-500 text-sm mt-1">{errors.sport}</p>}
            </div>

            <div>
              <Label htmlFor="surface">Surface *</Label>
              <Select value={formData.surface} onValueChange={(value) => setFormData({ ...formData, surface: value })}>
                <SelectTrigger className={errors.surface ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {surfaces.map((surface) => (
                    <SelectItem key={surface} value={surface}>
                      {surface}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.surface && <p className="text-red-500 text-sm mt-1">{errors.surface}</p>}
            </div>

            <div>
              <Label htmlFor="capacity">Capacité *</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className={errors.capacity ? "border-red-500" : ""}
                placeholder="Ex: 22 joueurs"
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Prix par heure (FCFA) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={errors.price ? "border-red-500" : ""}
                min="0"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="operatingStart">Heure d'ouverture</Label>
              <Input
                id="operatingStart"
                type="time"
                value={formData.operatingStart}
                onChange={(e) => setFormData({ ...formData, operatingStart: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="operatingEnd">Heure de fermeture</Label>
              <Input
                id="operatingEnd"
                type="time"
                value={formData.operatingEnd}
                onChange={(e) => setFormData({ ...formData, operatingEnd: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Photos du terrain</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG ou JPEG (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Terrain ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              {field ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
