"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false)

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
        <a href="#" onClick={(e) => handleScroll(e, 'home')} className="flex items-center gap-2 bg-green-600 px-3 sm:px-4 py-2 rounded-lg">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10">
            <Image src="/logo.png" alt="TOAD Logo" fill className="object-contain" priority />
          </div>
          <span className="font-bold text-xl sm:text-2xl text-white font-okay-jelly leading-none">TOAD</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white transition-colors">
            <a href="#about" onClick={(e) => handleScroll(e, 'about')}>About</a>
          </Button>
          <Button variant="ghost" className="bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white transition-colors">
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')}>Contact</a>
          </Button>
          <div className="relative">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              onClick={() => setIsGetStartedOpen(!isGetStartedOpen)}
            >
              Get Started
              <ChevronDown className={`h-4 w-4 transition-transform ${isGetStartedOpen ? 'rotate-180' : ''}`} />
            </Button>
            {isGetStartedOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-green-900 rounded-lg shadow-lg border border-gray-200 dark:border-green-800">
                <a
                  href="https://arbitrum.toadn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-green-800 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsGetStartedOpen(false);
                    window.open('https://arbitrum.toadn.com', '_blank');
                  }}
                >
                  <Image src="/arbitrum-logo.svg" alt="Arbitrum" width={20} height={20} />
                  Arbitrum
                </a>
                <a
                  href="https://optimism.toadn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-green-800 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsGetStartedOpen(false);
                    window.open('https://optimism.toadn.com', '_blank');
                  }}
                >
                  <Image src="/optimism-logo.svg" alt="Optimism" width={20} height={20} />
                  Optimism
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-green-800 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white dark:bg-green-900 border-b dark:border-green-800 transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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
          <div className="flex flex-col gap-2">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-2"
              onClick={() => window.open('https://arbitrum.toadn.com', '_blank')}
            >
              <Image src="/arbitrum-logo.svg" alt="Arbitrum" width={20} height={20} />
              Arbitrum
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-2"
              onClick={() => window.open('https://optimism.toadn.com', '_blank')}
            >
              <Image src="/optimism-logo.svg" alt="Optimism" width={20} height={20} />
              Optimism
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
