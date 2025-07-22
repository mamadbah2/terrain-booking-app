import SearchFilters from "@/components/search/SearchFilters"
import FieldGrid from "@/components/search/FieldGrid"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Rechercher un Terrain</h1>
        <p className="text-gray-600">Trouvez le terrain parfait pour votre prochaine session de sport</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <Suspense fallback={<FieldGridSkeleton />}>
            <FieldGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function FieldGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="w-full h-48 mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      ))}
    </div>
  )
}
