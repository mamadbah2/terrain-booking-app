"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, DollarSign, Search, User } from "lucide-react"
import FieldForm from "./FieldForm"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

interface Field {
  id: string
  name: string
  description: string
  location: string
  price: number
  sport: string
  surface: string
  capacity: string
  dimensions: string
  images: string[]
  amenities: Array<{ icon: string; name: string }>
  isActive: boolean
  ownerId: string
  managerId: string
  operatingHours: {
    start: string  // Changé de "opening" à "start"
    end: string    // Changé de "closing" à "end"
  }
  status: "active" | "inactive" // Ajouté la propriété status
  proprietaire?: {
    id: string
    name: string
    email: string
  }
}

export default function FieldManagement() {
  const { user } = useAuth()
  const [field, setField] = useState<Field | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

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

        if (response.ok && data.success) {
          // Transformer les données de l'API pour correspondre à l'interface Field
          const transformedField: Field = {
            ...data.terrain,
            operatingHours: {
              start: data.terrain.operatingHours?.opening || "08:00",
              end: data.terrain.operatingHours?.closing || "22:00"
            },
            status: data.terrain.isActive ? "active" : "inactive"
          }
          setField(transformedField)
        } else {
          setError(data.error || "Erreur lors de la récupération du terrain")
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

  const handleEdit = () => {
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const handleFormSubmit = async (fieldData: Partial<Field>) => {
    try {
      // TODO: Implement API call to update field
      console.log("Updating field:", fieldData)
      
      // For now, update local state
      if (field) {
        setField({ ...field, ...fieldData } as Field)
      }
      
      handleFormClose()
    } catch (error) {
      console.error("Error updating field:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
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

  if (!field) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun terrain assigné</h3>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas encore de terrain assigné à gérer. Contactez un propriétaire pour obtenir l'accès à un terrain.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mon terrain géré</h2>
          <p className="text-gray-600">Gérez votre terrain assigné</p>
        </div>
        <Button onClick={handleEdit} className="bg-green-600 hover:bg-green-700">
          <Edit className="w-4 h-4 mr-2" />
          Modifier le terrain
        </Button>
      </div>

      {/* Field Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="relative h-64">
            <Image 
              src={field.images[0] || "/placeholder.svg"} 
              alt={field.name} 
              fill 
              className="object-cover" 
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {field.sport}
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <Badge className={field.isActive ? "bg-green-500" : "bg-gray-500"}>
                {field.isActive ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <h3 className="font-bold text-xl text-gray-900 mb-3">{field.name}</h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{field.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-5 h-5 mr-3" />
                <span className="font-semibold">{field.price.toLocaleString()} FCFA/heure</span>
              </div>
              {field.proprietaire && (
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-3" />
                  <span>Propriétaire: {field.proprietaire.name}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <span className="font-medium mr-3">Horaires:</span>
                <span>{field.operatingHours.start} - {field.operatingHours.end}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{field.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Surface:</span>
                <p className="text-gray-600">{field.surface}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Capacité:</span>
                <p className="text-gray-600">{field.capacity}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Dimensions:</span>
                <p className="text-gray-600">{field.dimensions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities Card */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Équipements disponibles</h4>
            <div className="grid grid-cols-2 gap-3">
              {field.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{amenity.name}</span>
                </div>
              ))}
            </div>

            {field.amenities.length === 0 && (
              <p className="text-gray-500 text-sm">Aucun équipement spécifique renseigné</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Images */}
      {field.images.length > 1 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Galerie photos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {field.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                  <Image 
                    src={image} 
                    alt={`${field.name} - Photo ${index + 2}`} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Form Modal */}
      <FieldForm 
        isOpen={isFormOpen} 
        onClose={handleFormClose} 
        onSubmit={handleFormSubmit} 
        field={field} 
      />
    </div>
  )
}
