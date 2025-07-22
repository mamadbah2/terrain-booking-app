import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TerrainBook - Réservation de Terrains de Sport",
  description: "Trouvez et réservez des terrains de sport près de chez vous",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
