"use client"

import { useEffect, useState } from "react"
import FieldCard from "./FieldCard"
import { useSearchParams } from "next/navigation"



export default function FieldGrid() {

  const [fields, setFields] = useState([])
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchFields = async () => {
      setError(null)
      setLoading(true)
      try {
        const query = new URLSearchParams(searchParams.toString())
        const response = await fetch(`/api/terrains?${query.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des terrains")
        }

        const data = await response.json()

        console.log("Terrains récupérés:", data)
        
        setFields(data)
      } catch (err:any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFields()

  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-center">Erreur: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{fields.length} terrains trouvés</p>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Trier par prix</option>
          <option>Prix croissant</option>
          <option>Prix décroissant</option>
          <option>Disponibilité</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fields.map((field:any) => (
          <FieldCard key={field._id} field={field} />
        ))}
      </div>
    </div>
  )
}
