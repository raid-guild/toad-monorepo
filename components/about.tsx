import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Vote, Users, Bot, Code, Shield, Target, Heart, Scale, Eye, Sparkles, User } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-20">
      {/* About - Light */}
      <div className="bg-white dark:bg-green-900 py-12 sm:py-20">
      <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="col-span-1 flex items-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 font-okay-jelly">About</h2>
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="h-full space-y-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-green-800 dark:text-green-300">What is TOAD?</h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-green-200 font-thin">
                    TOAD (Trustless Onchain Autonomous Delegate) is an AI-powered voting delegate system that revolutionizes DAO governance. Operating as an autonomous agent, TOAD analyzes proposals, gathers community sentiment, and casts votes with delegated power, serving as a crucial step toward AI-governed DAOs.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-semibold text-green-800 dark:text-green-300">Mission</h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-green-200 font-thin">
                    TOAD exists to democratize governance by creating an unbiased, accessible bridge between communities and their decision-making processes. We're building the future of decentralized governance where technology amplifies collective wisdom rather than replacing it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values - Dark */}
      <div className="bg-green-50 dark:bg-green-800 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="col-span-1 flex items-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 font-okay-jelly">Values</h2>
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="h-full">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Eye className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Transparency</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">We believe in fully transparent decision-making where reasoning is as important as the outcome.</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Heart className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Inclusivity</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">We're breaking down technical barriers to ensure everyone can participate meaningfully in governance.</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Scale className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Impartiality</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">We're committed to decisions based solely on community guidelines and collective benefit—never personal gain.</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Shield className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Accountability</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">Every vote cast through TOAD comes with clear reasoning that can be verified and challenged.</p>
                      </CardContent>
                    </Card>

          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Sparkles className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Innovation</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">We're pioneering the path toward AI-governed DAOs while ensuring humans remain central to signaling and oversight.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Light */}
      <div className="bg-white dark:bg-green-900 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="col-span-1 flex items-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 font-okay-jelly">Features</h2>
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="h-full">
                  <div className="grid grid-cols-1 gap-4 sm:gap-8">
                    <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Code className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">AI Analysis Engine</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">Processes proposals, discussions, and sentiment using advanced LLM technology</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                <Vote className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Smart Contract Integration</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">Direct on-chain voting through secure wallet infrastructure</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Cross-Platform Monitoring</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">Tracks governance activity across Tally, social media, and forums</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Eye className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Transparent Decision Logic</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">Provides reasoning before voting occurs</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-700 dark:bg-green-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit mb-4">
                          <Shield className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Security-First Design</h4>
                        <p className="text-gray-600 dark:text-green-100 font-thin">Member-gated interface with verifiable execution</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions - Dark */}
      <div className="bg-green-50 dark:bg-green-800 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="col-span-1 flex items-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 font-okay-jelly">Solutions</h2>
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
                    {/* Community Members Path */}
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-200 dark:bg-green-700 rounded-full"></div>
                      <div className="ml-8 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-full w-fit shrink-0">
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">Community Members</h4>
                            <p className="text-gray-600 dark:text-green-100 font-thin">Individual token holders and community participants</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="bg-red-50 dark:bg-red-900/50 p-3 rounded-full w-fit shrink-0">
                            <Target className="h-6 w-6 text-red-600 dark:text-red-300" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Problem</h4>
                            <p className="text-gray-600 dark:text-green-100 font-thin">Fragmented governance across chains, complex proposals, poor communication</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit shrink-0">
                            <Bot className="h-6 w-6 text-green-600 dark:text-green-300" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Solution</h4>
                            <p className="text-gray-600 dark:text-green-100 font-thin">Simplified delegation process, accessible information, continuous reporting</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DAOs Path */}
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-200 dark:bg-green-700 rounded-full"></div>
                      <div className="ml-8 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-full w-fit shrink-0">
                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">DAOs</h4>
                            <p className="text-gray-600 dark:text-green-100 font-thin">Decentralized Autonomous Organizations and governance systems</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="bg-red-50 dark:bg-red-900/50 p-3 rounded-full w-fit shrink-0">
                            <Target className="h-6 w-6 text-red-600 dark:text-red-300" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Problem</h4>
                            <p className="text-gray-600 dark:text-green-100 font-thin">Delegates lack expertise, have conflicts of interest, and are overburdened</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="bg-green-50 dark:bg-green-700/50 p-3 rounded-full w-fit shrink-0">
                            <Bot className="h-6 w-6 text-green-600 dark:text-green-300" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Solution</h4>
                            <p className="text-gray-600 dark:text-green-100 font-thin">Unbiased AI-powered decision making based on community guidelines</p>
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
      </div>
    </section>
  )
}
