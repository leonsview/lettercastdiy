/*
<ai_context>
The root server layout for the app.
</ai_context>
*/

import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster as SonnerToaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "lettercast.fyi",
  description: "Your newsletters turned into podcasts."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
          inter.className
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PostHogPageview />

          {children}

          <TailwindIndicator />
          <SonnerToaster />
        </Providers>
      </body>
    </html>
  )
}
