import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  )
}
