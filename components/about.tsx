import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Vote, Users, Bot, Code, Shield, Target, Heart, Scale, Eye, Sparkles, User, Building2 } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-20">
      {/* About - Light */}
      <div className="bg-white dark:bg-green-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-4xl font-bold mb-4 font-okay-jelly">About</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <h3 className="text-2xl font-bold mb-4">What is TOAD?</h3>
                <p className="text-lg mb-8">
                  TOAD is a revolutionary platform designed to transform how DAOs and communities make decisions. By leveraging advanced AI technology, TOAD provides unbiased, transparent, and efficient governance solutions that empower communities to reach consensus and make informed decisions.
                </p>
              </div>
              <div className="col-span-1 md:col-span-3">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg mb-8">
                  Our mission is to democratize decision-making in DAOs and communities by providing accessible, transparent, and efficient governance tools. We believe that by combining AI technology with community input, we can create a more equitable and effective decision-making process for all.
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
                <h2 className="text-4xl font-bold mb-8 font-okay-jelly">Values</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Eye className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Transparency</h3>
                    </div>
                    <p>Open and clear decision-making processes</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Heart className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Inclusivity</h3>
                    </div>
                    <p>Equal voice for all community members</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Scale className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Impartiality</h3>
                    </div>
                    <p>Unbiased analysis and recommendations</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Accountability</h3>
                    </div>
                    <p>Clear responsibility for decisions</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Sparkles className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Innovation</h3>
                    </div>
                    <p>Continuous improvement and adaptation</p>
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
                <h2 className="text-4xl font-bold mb-8 font-okay-jelly">Features</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">AI-Powered Analysis</h3>
                    <p>Advanced AI algorithms analyze proposals and discussions to provide unbiased insights and recommendations.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Transparent Voting</h3>
                    <p>Secure and verifiable voting system with real-time results and audit trails.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Community Engagement</h3>
                    <p>Tools for discussion, feedback, and collaboration to ensure all voices are heard.</p>
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
                <h2 className="text-4xl font-bold mb-8 font-okay-jelly">Solutions</h2>
              </div>
              <div className="col-span-1 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Community Members Path */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Users className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">Community Members</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                          <span className="text-green-600 dark:text-green-300 font-bold">1</span>
                        </div>
                        <p>Group: Community Members</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                          <span className="text-green-600 dark:text-green-300 font-bold">2</span>
                        </div>
                        <p>Problem: Need to understand and participate in DAO governance</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                          <span className="text-green-600 dark:text-green-300 font-bold">3</span>
                        </div>
                        <p>Solution: TOAD provides clear insights and voting tools</p>
                      </div>
                    </div>
                  </div>

                  {/* DAOs Path */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <Building2 className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-bold">DAOs</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                          <span className="text-green-600 dark:text-green-300 font-bold">1</span>
                        </div>
                        <p>Group: DAOs</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                          <span className="text-green-600 dark:text-green-300 font-bold">2</span>
                        </div>
                        <p>Problem: Need efficient and fair governance</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                          <span className="text-green-600 dark:text-green-300 font-bold">3</span>
                        </div>
                        <p>Solution: TOAD offers AI-powered governance tools</p>
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
