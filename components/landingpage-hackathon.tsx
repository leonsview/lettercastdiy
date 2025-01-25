"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Headphones, Clock, Inbox, Zap, Github } from 'lucide-react'
import Link from "next/link"
import NewsletterToPodcast from "./landingpage-example/newsletter-to-podcast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lettercast</h1>
        <Link href="/login">
          <Button variant="outline" size="sm">Login</Button>
        </Link>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Newsletter Chaos into Your Personal Podcast</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Break free from inbox overwhelm. Get the insights you love, delivered as a weekly AI-powered podcast episode – right to your WhatsApp.
          </p>
          <Link href="/signup">
            <Button size="lg" className="animate-pulse">
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
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

            <div className="mt-16">
              <div className="w-full max-w-2xl mx-auto mb-16 border-t border-gray-200" />
              <h3 className="text-2xl font-semibold text-center mb-8">See It In Action</h3>
              <NewsletterToPodcast />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Everything you need to transform your newsletters into podcasts</h2>
              <div className="text-lg text-muted-foreground space-y-4">
                <p>
                  Lettercast started as a fun side project I built for myself. After seeing how many people were interested in using it, I quickly added profiles and authentication to make it available for everyone.
                </p>
                <p>
                  To cover the running costs, there's a €5 monthly subscription. Feel free to use it yourself! Happy to keep adding features based on your feedback.
                </p>
              </div>
            </div>

            <div className="grid gap-8">
              <Card className="w-full max-w-lg mx-auto">
                <CardContent className="pt-6 pb-4">
                  <div className="mb-4 text-3xl font-bold">€5/month</div>
                  <ul className="space-y-2">
                    <li>✓ Up to 15 newsletter subscriptions</li>
                    <li>✓ Weekly personalized podcast episodes</li>
                    <li>✓ WhatsApp delivery</li>
                    <li>✓ Priority support</li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pt-0">
                  <Link href="/signup" className="w-full">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      Get Started
                      <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <div className="text-center">
                <p className="mb-4 text-muted-foreground">
                  Want to run it yourself? (probably more expensive)<br />
                  Check out the repository:
                </p>
                <Link 
                  href="https://github.com/leonsandner/lettercast"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Lettercast?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: "Save Time", description: "Get the essence of all your newsletters in just 10 minutes" },
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
            <Link href="/signup">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-gray-900 border-white hover:bg-white hover:text-gray-900"
              >
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm text-gray-600">
            © 2025 Lettercast. All rights reserved.
          </div>
          <div className="mt-2 space-x-4 text-sm">
            <a href="mailto:mail@leonsandner.com" className="text-gray-600 hover:text-gray-900">Contact</a>
            <a href="https://publyc.app/terms.html" className="text-gray-600 hover:text-gray-900">Terms</a>
            <a href="https://publyc.app/privacy.html" className="text-gray-600 hover:text-gray-900">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

