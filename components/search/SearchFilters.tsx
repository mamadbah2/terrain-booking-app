"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react"

export default function SearchFilters() {
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sportTypes, setSportTypes] = useState<string[]>([])

  const sports = ["Football", "Basketball", "Tennis", "Volleyball", "Handball", "Badminton"]

  const handleSportChange = (sport: string, checked: boolean) => {
    if (checked) {
      setSportTypes([...sportTypes, sport])
    } else {
      setSportTypes(sportTypes.filter((s) => s !== sport))
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Filtres</h2>

      {/* Location */}
      <div className="mb-6">
        <Label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          Localisation
        </Label>
        <Input
          id="location"
          type="text"
          placeholder="Ville ou quartier"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Date */}
      <div className="mb-6">
        <Label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          Date
        </Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full" />
      </div>

      {/* Time */}
      <div className="mb-6">
        <Label htmlFor="time" className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          Heure
        </Label>
        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full" />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 mr-2" />
          Prix (FCFA)
        </Label>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={100000} step={5000} className="w-full" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{priceRange[0].toLocaleString()} FCFA</span>
            <span>{priceRange[1].toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Sport Types */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Type de sport</Label>
        <div className="space-y-2">
          {sports.map((sport) => (
            <div key={sport} className="flex items-center space-x-2">
              <Checkbox
                id={sport}
                checked={sportTypes.includes(sport)}
                onCheckedChange={(checked) => handleSportChange(sport, checked as boolean)}
              />
              <Label htmlFor={sport} className="text-sm text-gray-600">
                {sport}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button className="w-full bg-green-600 hover:bg-green-700">Appliquer les filtres</Button>
    </div>
  )
}
