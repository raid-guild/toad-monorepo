import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Ecosystem from "@/components/ecosystem"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <About />
        <Ecosystem />
        <Contact />
        <Footer />
      </main>
    </ThemeProvider>
  )
}
