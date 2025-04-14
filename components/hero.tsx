import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner.jpeg"
          alt="TOAD Environment"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white dark:from-green-900/0 via-green-900/50 dark:to-green-900"></div>
      </div>

      <div className="container mx-auto px-4 h-screen flex items-center justify-center relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-green-800 dark:text-green-300 mb-6 font-okay-jelly">TOAD</h1>
          <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-green-100">
            Trustless On-Chain Autonomous Delegate
          </p>
        </div>
      </div>
    </section>
  )
}
