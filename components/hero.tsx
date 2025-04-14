import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner.jpeg"
          alt="TOAD Environment"
          fill
          className="object-cover opacity-20 dark:opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white dark:from-green-900/0 dark:to-green-900"></div>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto w-24 h-24 relative mb-6">
            <Image src="/logo.png" alt="TOAD Logo" fill className="object-contain dark:invert" priority />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 dark:text-green-300 mb-6">TOAD</h1>

          <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-green-100 mb-4">
            Trustless On-Chain Autonomous Delegate
          </p>

          <p className="text-lg text-gray-600 dark:text-green-200 mb-8">
            Smoothing DAO governance by absorbing community sentiment and empowering users with AI-driven delegation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-6">
              Explore TOAD
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-green-600 text-green-700 dark:text-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-800/30 text-lg px-6 py-6"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
