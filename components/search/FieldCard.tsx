import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Clock } from "lucide-react"

interface Field {
  _id: string
  name: string
  location: string
  pricePerHour: number
  images: string[]
  sport: string
  description: string
  amenities: Array<{icon: string, name: string}>
  surface: string
  dimensions: string
  capacity: string
  isActive: boolean
  ownerId: string
}

interface FieldCardProps {
  field: Field
}

export default function FieldCard({ field }: FieldCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image src={field.images[0] || "/placeholder.svg"} alt={field.name} fill className="object-cover" />
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
          {field.sport}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{field.name}</h3>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {field.location}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{field.description}</p>

        {/* C'est les ameneties */}
        {/* <div className="flex items-center mb-3">
          <div className="flex flex-wrap gap-1">
            {field.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {amenity.name}
              </span>
            ))}
            {field.amenities.length > 3 && (
              <span className="text-gray-500 text-xs">+{field.amenities.length - 3} autres</span>
            )}
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">{field.pricePerHour.toLocaleString()} FCFA</div>
          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
            <Link href={`/terrains/${field._id}`}>Voir Détails</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
