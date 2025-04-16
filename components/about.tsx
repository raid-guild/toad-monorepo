import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Vote, Users, Bot, Code, Shield, Target, Heart, Scale, Eye, Sparkles, User, AlertCircle, Lightbulb, Building2, Brain, ChartBar } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-20">
      {/* About - Light */}
      <div className="bg-white dark:bg-green-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-4xl font-bold mb-6 font-okay-jelly">About</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <h3 className="text-2xl font-bold mb-4">What is TOAD?</h3>
                <p className="text-lg mb-6">
                  TOAD is a revolutionary platform designed to transform how DAOs (Decentralized Autonomous Organizations) operate and make decisions. By leveraging advanced AI technology, TOAD provides a comprehensive suite of tools that enhance transparency, efficiency, and fairness in DAO governance.
                </p>
              </div>
              <div className="col-span-1 md:col-span-3">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg">
                  Our mission is to democratize DAO governance by making it more accessible, transparent, and efficient. We believe that by empowering DAOs with the right tools, we can help create a more equitable and decentralized future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values - Dark */}
      <div className="bg-green-50 dark:bg-green-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-4xl font-bold mb-6 font-okay-jelly">Values</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Eye className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Transparency</h3>
                    </div>
                    <p>We believe in open and clear communication, ensuring all stakeholders have access to the information they need.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Heart className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Inclusivity</h3>
                    </div>
                    <p>We strive to create a platform that welcomes and supports all members of the DAO community.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Scale className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Impartiality</h3>
                    </div>
                    <p>Our platform ensures fair and unbiased decision-making processes for all DAO members.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Accountability</h3>
                    </div>
                    <p>We hold ourselves and our users to the highest standards of responsibility and integrity.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Sparkles className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Innovation</h3>
                    </div>
                    <p>We continuously push the boundaries of what's possible in DAO governance and decision-making.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Light */}
      <div className="bg-white dark:bg-green-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-4xl font-bold mb-6 font-okay-jelly">Features</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Brain className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                    </div>
                    <p>Advanced AI algorithms analyze proposals and discussions to provide insights and recommendations.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Vote className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Smart Voting</h3>
                    </div>
                    <p>Intelligent voting systems that help members make informed decisions based on data and community sentiment.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <ChartBar className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Analytics Dashboard</h3>
                    </div>
                    <p>Comprehensive analytics and reporting tools to track DAO performance and member engagement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions - Dark */}
      <div className="bg-green-50 dark:bg-green-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-4xl font-bold mb-6 font-okay-jelly">Solutions</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Community Members Path */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">Community Members</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold">Group</h4>
                          <p className="text-gray-600 dark:text-gray-400">Join a DAO community</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold">Problem</h4>
                          <p className="text-gray-600 dark:text-gray-400">Complex governance processes</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold">Solution</h4>
                          <p className="text-gray-600 dark:text-gray-400">AI-powered decision support</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DAOs Path */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">DAOs</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold">Group</h4>
                          <p className="text-gray-600 dark:text-gray-400">DAO organization</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold">Problem</h4>
                          <p className="text-gray-600 dark:text-gray-400">Inefficient governance</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold">Solution</h4>
                          <p className="text-gray-600 dark:text-gray-400">Streamlined governance tools</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
