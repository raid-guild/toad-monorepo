import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Vote, Users, Bot } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-green-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">About TOAD</h2>
          <p className="text-lg text-gray-600 dark:text-green-200">
            TOAD is a Trustless On-Chain Autonomous Delegate that revolutionizes DAO governance by leveraging AI to
            bridge the gap between community sentiment and on-chain voting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                Community Sentiment Analysis
              </h3>
              <p className="text-gray-600 dark:text-green-100">
                TOAD absorbs community sentiment from forums, Twitter, Warpcast, and Discord to understand the
                collective voice of your DAO.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                <Vote className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Intelligent Delegation</h3>
              <p className="text-gray-600 dark:text-green-100">
                Users can delegate their voting power to TOAD, which votes based on community sentiment and the best
                interests of the DAO.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                <Bot className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-green-100">
                Ask TOAD questions about current proposals and receive unbiased, data-driven insights to inform your
                voting decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Trustless Architecture</h3>
              <p className="text-gray-600 dark:text-green-100">
                Built on a fully transparent and trustless architecture, TOAD ensures that governance remains
                decentralized and resistant to manipulation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
