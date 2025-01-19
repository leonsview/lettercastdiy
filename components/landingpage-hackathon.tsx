import { Button } from "@/components/ui/button"
import { ArrowRight, Headphones, Clock, Inbox, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lettercast</h1>
        <Button variant="outline" size="sm">Login</Button>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Transform Newsletter Chaos into Your Personal Audio Digest</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Break free from inbox overwhelm. Get the insights you love, delivered as a weekly AI-powered podcast episode – right to your WhatsApp.
          </p>
          <Button size="lg" className="animate-pulse">
            Get Started
            <ArrowRight className="ml-2" />
          </Button>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Tell Us What You Love", description: "Connect your favorite newsletters to Lettercast. We'll handle the inbox management." },
                { title: "We Curate, You Listen", description: "Every week, our AI creates a personalized podcast episode highlighting the most relevant insights from your subscriptions." },
                { title: "Wherever You Are", description: "Get your personalized audio digest and text summary via WhatsApp. Listen during your commute, workout, or morning coffee." }
              ].map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Lettercast?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: "Save Time", description: "Get the essence of all your newsletters in just 15 minutes" },
              { icon: Inbox, title: "Zero Inbox Clutter", description: "Say goodbye to newsletter overwhelm" },
              { icon: Headphones, title: "Ultra-Convenient", description: "Listen on WhatsApp – no new apps needed" },
              { icon: Zap, title: "Perfectly Personal", description: "Each episode is crafted specifically for your interests" }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <feature.icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">The Future of Content is Here</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the revolution in personalized content consumption. Experience your newsletters in a whole new way with Lettercast.
            </p>
            <Button size="lg" variant="outline" className="text-gray-900 border-white hover:bg-white hover:text-gray-900">
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2023 Lettercast. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

