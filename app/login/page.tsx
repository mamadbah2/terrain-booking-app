"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "proprio") {
        router.push("/dashboard")
      } else if (user.role === "gerant") {
        router.push("/gestion")
      }
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      // La redirection sera gérée par l'useEffect ci-dessus
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TerrainBook</span>
          </div>
          <CardTitle className="text-2xl font-bold">Connexion Staff</CardTitle>
          <CardDescription>Accès réservé aux Gérants et Propriétaires</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="mb-2">Comptes de test :</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Gérant:</strong> jane.smith@example.com / hashed_password_456
              </p>
              <p>
                <strong>Proprio:</strong> john.doe@example.com / hashed_password_123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
