import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-white dark:bg-green-900">
        <Navbar />
        <Hero />
        <About />
        <Contact />
        <Footer />
      </main>
    </ThemeProvider>
  )
}
