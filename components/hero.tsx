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
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[18rem] font-bold text-green-800 dark:text-green-300 mb-4 sm:mb-6 font-okay-jelly leading-tight">TOAD</h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 dark:text-green-100 max-w-2xl mx-auto">
            Trustless On-Chain Autonomous Delegate
          </p>
        </div>
      </div>
    </section>
  )
}
