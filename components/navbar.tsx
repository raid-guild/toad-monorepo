"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" onClick={(e) => handleScroll(e, 'home')} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg">
          <div className="relative h-10 w-10">
            <Image src="/logo.png" alt="TOAD Logo" fill className="object-contain" priority />
          </div>
          <span className="font-bold text-2xl text-white font-okay-jelly leading-none">TOAD</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white transition-colors">
            <a href="#about" onClick={(e) => handleScroll(e, 'about')}>About</a>
          </Button>
          <Button variant="ghost" className="bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white transition-colors">
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')}>Contact</a>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <a href="#get-started" onClick={(e) => handleScroll(e, 'get-started')}>Get Started</a>
          </Button>
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
            <a
              href="#about"
              className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors py-2"
              onClick={(e) => handleScroll(e, 'about')}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 transition-colors py-2"
              onClick={(e) => handleScroll(e, 'contact')}
            >
              Contact
            </a>
            <ThemeToggle />
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
              <a href="#get-started" onClick={(e) => handleScroll(e, 'get-started')}>Get Started</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
