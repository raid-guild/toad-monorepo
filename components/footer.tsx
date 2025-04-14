import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-green-900 dark:bg-green-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10 bg-white dark:bg-green-800 rounded-full p-1">
                <Image src="/logo.png" alt="TOAD Logo" fill className="object-contain dark:invert" />
              </div>
              <span className="font-bold text-xl">TOAD</span>
            </div>
            <p className="text-green-100 dark:text-green-100 mb-4">Trustless On-Chain Autonomous Delegate</p>
            <div className="flex gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                className="text-white hover:text-green-200 transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-white hover:text-green-200 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href="https://warpcast.com"
                target="_blank"
                className="text-white hover:text-green-200 transition-colors"
              >
                <ExternalLink className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-green-100 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#ecosystem" className="text-green-100 hover:text-white transition-colors">
                  Ecosystem
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-green-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-green-100 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-100 hover:text-white transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-100 hover:text-white transition-colors">
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-green-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-100 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-100 hover:text-white transition-colors">
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 dark:border-green-800 mt-12 pt-6 text-center text-green-200">
          <p>© {new Date().getFullYear()} TOAD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
