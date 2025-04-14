import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-green-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 dark:text-green-100">
            Have questions about TOAD? Want to integrate it with your DAO? Get in touch with our team.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-green-100 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-green-500 dark:bg-green-800"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-green-100 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-green-500 dark:bg-green-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-green-100 mb-1">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="How can we help?"
                className="border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-green-500 dark:bg-green-800"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-green-100 mb-1">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Your message..."
                rows={5}
                className="border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-green-500 dark:bg-green-800"
              />
            </div>

            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
