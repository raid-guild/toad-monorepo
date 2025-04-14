"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-green-900/80 backdrop-blur-md border-b dark:border-green-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10">
            <Image src="/logo.png" alt="TOAD Logo" fill className="object-contain" priority />
          </div>
          <span className="font-bold text-xl text-green-800 dark:text-green-300">TOAD</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#about"
            className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors"
          >
            About
          </Link>
          <Link
            href="#ecosystem"
            className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors"
          >
            Ecosystem
          </Link>
          <Link
            href="#contact"
            className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors"
          >
            Contact
          </Link>
          <ThemeToggle />
          <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-green-900 border-b dark:border-green-800">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="#about"
              className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#ecosystem"
              className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Ecosystem
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <ThemeToggle />
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
