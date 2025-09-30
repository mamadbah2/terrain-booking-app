import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Wifi, Car, Shield } from "lucide-react"
import BookingSection from "@/components/terrain/BookingSection"
import { JSX } from "react"

async function getTerrainById(id: string) {
  try {
     const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(
      `${baseUrl}/api/terrains/${id}`,
      {
        cache: "no-store",
      }
    )

    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Erreur lors de la récupération du terrain: ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error("Erreur lors de la récupération du terrain:", error)
    return null
  }
}

interface PageProps {
  params: { id: string }
}

export default async function TerrainDetailsPage({ params }: PageProps) {
  const { id } = await params
  const terrain = await getTerrainById(id)

  if (!terrain) {
    notFound()
  }

  // Associer les icônes aux noms d'amenities
  const amenitiesWithIcons = terrain.amenities.map((amenity: { icon: string; name: string }) => {
    let icon
    switch (amenity.icon) {
      case "Wifi":
        icon = <Wifi className="w-5 h-5" />
        break
      case "Car":
        icon = <Car className="w-5 h-5" />
        break
      case "Shield":
        icon = <Shield className="w-5 h-5" />
        break
      case "Users":
        icon = <Users className="w-5 h-5" />
        break
      default:
        icon = <div className="w-5 h-5 bg-gray-400 rounded-full" />
    }
    return { ...amenity, icon }
  })

  // Adapter le format du terrain pour BookingSection
  const fieldForBooking = {
    ...terrain,
    id: terrain._id,
    price: terrain.pricePerHour,
    amenities: amenitiesWithIcons,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {terrain.sport}
          </Badge>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {terrain.location}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{terrain.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Image
                  src={terrain.images[0] || "/placeholder.svg"}
                  alt={terrain.name}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
              </div>
              {terrain.images.slice(1).map((image: string, index: number) => (
                <Image
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${terrain.name} ${index + 2}`}
                  width={300}
                  height={200}
                  className="w-full h-32 md:h-40 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{terrain.description}</p>
          </div>

          {/* Specifications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Capacité</span>
                </div>
                <p className="text-gray-600">{terrain.capacity}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="w-5 h-5 bg-green-600 rounded mr-2"></span>
                  <span className="font-medium text-gray-900">Surface</span>
                </div>
                <p className="text-gray-600">{terrain.surface}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="w-5 h-5 bg-blue-600 rounded mr-2"></span>
                  <span className="font-medium text-gray-900">Dimensions</span>
                </div>
                <p className="text-gray-600">{terrain.dimensions}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Équipements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenitiesWithIcons.map(
                (amenity: { icon: JSX.Element; name: string }, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-600">
                    {amenity.icon}
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <BookingSection field={fieldForBooking} />
        </div>
      </div>
    </div>
  )
}
