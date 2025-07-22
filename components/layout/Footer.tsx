import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              À propos de TerrainBook
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">
                  Qui sommes-nous ?
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact / support
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-gray-900 text-sm">
                  Communiqué de presse
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Devenir Partenaire */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Devenir Partenaire</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/partner" className="text-gray-600 hover:text-gray-900 text-sm">
                  Qui sommes-nous ?
                </Link>
              </li>
              <li>
                <Link href="/partner/contact" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact / support
                </Link>
              </li>
              <li>
                <Link href="/partner/press" className="text-gray-600 hover:text-gray-900 text-sm">
                  Communiqué de presse
                </Link>
              </li>
              <li>
                <Link href="/partner/faq" className="text-gray-600 hover:text-gray-900 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Blog</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900 text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Communauté */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Communauté</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/community" className="text-gray-600 hover:text-gray-900 text-sm">
                  Communauté
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">Suivez nous sur nos réseaux !</p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
