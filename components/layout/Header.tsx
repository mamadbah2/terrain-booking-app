"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const publicNavigationItems = [
    { name: "Home", href: "/" },
    { name: "Retrouver ma Réservation", href: "/retrouver-reservation" },
  ]

  const staffNavigationItems = [
    { name: "Gestion des Terrains", href: "/gestion", roles: ["gerant"] },
    { name: "Tableau de Bord", href: "/dashboard", roles: ["proprio"] },
  ]

  const visibleStaffItems = staffNavigationItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TerrainBook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {publicNavigationItems.map((item) => {

              return visibleStaffItems.length != 0 ? null : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              )
            })}
            {visibleStaffItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{user?.role}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <Link href="/login">Connexion Staff</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {publicNavigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {visibleStaffItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">{user?.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{user?.role}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="mx-3 w-auto bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="px-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      <Link href="/login">Connexion Staff</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
