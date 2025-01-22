"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Github } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function SubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubscribe = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const data = await response.json()

      if (!data.url) {
        throw new Error("No checkout URL returned")
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Error:", error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to start checkout process"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Everything you need to transform your newsletters into podcasts</h1>
        <div className="text-lg leading-relaxed text-muted-foreground space-y-4">
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
            <Button 
              onClick={onSubscribe}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {loading ? "Loading..." : "Subscribe Now"}
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              Secure payment powered by Stripe
            </div>
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
  )
} 
