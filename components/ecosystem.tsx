import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function Ecosystem() {
  const platforms = [
    {
      name: "Forums",
      description: "TOAD analyzes discussions on community forums to gauge sentiment on proposals.",
      icon: "message-circle",
    },
    {
      name: "Twitter",
      description: "Social media sentiment analysis helps TOAD understand the broader community perspective.",
      icon: "twitter",
    },
    {
      name: "Warpcast",
      description: "Integration with Warpcast provides TOAD with insights from the Farcaster ecosystem.",
      icon: "cast",
    },
    {
      name: "Discord",
      description: "TOAD monitors Discord channels to capture real-time community discussions.",
      icon: "message-square",
    },
  ]

  return (
    <section id="ecosystem" className="py-20 bg-green-50 dark:bg-green-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">Ecosystem</h2>
          <p className="text-lg text-gray-600 dark:text-green-100">
            TOAD integrates with multiple platforms to create a comprehensive view of community sentiment and enable
            effective governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, index) => (
            <Card
              key={index}
              className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">{platform.name}</h3>
                <p className="text-gray-600 dark:text-green-100 mb-4">{platform.description}</p>
                <div className="flex items-center text-green-600 dark:text-green-300 font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-green-800 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">How TOAD Works</h3>
              <p className="text-gray-600 dark:text-green-100 mb-4">
                TOAD uses advanced AI algorithms to process and analyze data from multiple sources, creating a
                comprehensive view of community sentiment.
              </p>
              <p className="text-gray-600 dark:text-green-100 mb-4">
                This sentiment analysis is combined with proposal details to inform voting decisions, ensuring that
                governance reflects the true will of the community.
              </p>
              <p className="text-gray-600 dark:text-green-100">
                Users can delegate their voting power to TOAD or use its insights to make more informed decisions when
                voting directly.
              </p>
            </div>
            <div className="relative h-64 md:h-80">
              <div className="absolute inset-0 flex items-center justify-center bg-green-100 dark:bg-green-700/30 rounded-lg">
                <div className="relative w-24 h-24">
                  <Image src="/logo.png" alt="TOAD Logo" fill className="object-contain dark:invert" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
