import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import React from "react"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}