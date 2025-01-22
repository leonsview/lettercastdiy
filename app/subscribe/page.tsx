"use server"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Github } from "lucide-react"
import Link from "next/link"

export default async function SubscribePage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  // Construct the success URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const successUrl = `${baseUrl}/`
  const stripePaymentLink = `${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY}?client_reference_id=${userId}&success_url=${encodeURIComponent(successUrl)}`

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="mb-6 text-4xl font-bold">Subscribe to unlock the power of lettercast</h1>
        <div className="text-xl leading-relaxed text-muted-foreground space-y-4">
          <p>
            Lettercast started as a fun side project I built for myself. After seeing how many people were interested in using it, I quickly added profiles and authentication to make it available for everyone.
          </p>
          <p>
            To cover the running costs, there's a €5 monthly subscription. Feel free to use it yourself! Happy to keep adding features based on your feedback.
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Everything you need to transform your newsletters into podcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-4xl font-bold">€5/month</div>
            <ul className="space-y-3 text-lg">
              <li>✓ Up to 15 newsletter subscriptions</li>
              <li>✓ Weekly personalized podcast episodes</li>
              <li>✓ WhatsApp delivery</li>
              <li>✓ Priority support</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link 
              href={stripePaymentLink}
              className="w-full"
            >
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Subscribe Now
              </Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
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