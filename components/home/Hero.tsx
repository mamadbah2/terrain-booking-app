"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/rechercher?location=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="bg-gradient-to-br from-green-500 to-green-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Réserve un terrain</h1>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ville ou Quartier"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-gray-900 bg-white border-0 rounded-l-lg focus:ring-2 focus:ring-green-300"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Button
              type="submit"
              className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-r-lg font-medium"
            >
              Rechercher
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
