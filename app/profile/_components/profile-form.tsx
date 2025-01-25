"use client"

import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectProfile } from "@/db/schema"
import { updateProfileAction } from "@/actions/db/profiles-actions"
import { checkNewsletterExistsAction, createNewsletterAction } from "@/actions/db/newsletters-actions"
import { sendWhatsAppWelcomeAction } from "@/actions/whatsapp-actions"

interface ProfileFormProps {
  userId: string
  initialData?: SelectProfile
}

interface FormValues {
  firstName: string
  email: string
  phone: string
  newsletter: string
}

export default function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [newsletters, setNewsletters] = useState<string[]>(initialData?.newsletters || [])
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      firstName: initialData?.firstName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      newsletter: ""
    }
  })

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      // Check if phone number was added or changed
      const phoneChanged = values.phone !== initialData?.phone && values.phone !== ""
      
      // Update profile first
      const { isSuccess, message } = await updateProfileAction(userId, values)
      if (!isSuccess) {
        toast.error(message)
        return
      }
      
      // If profile update was successful
      toast.success(message)
      
      // If phone number was added/changed, check if we should send welcome message
      if (phoneChanged) {
        const { isSuccess: whatsappSuccess, message: whatsappMessage } = await sendWhatsAppWelcomeAction(values.phone, userId)
        if (!whatsappSuccess) {
          toast.error(whatsappMessage)
        } else if (whatsappMessage !== "Welcome message already sent to this number") {
          toast.success("Welcome message sent successfully!")
        }
      }

      // Handle newsletter updates if any
      if (values.newsletter) {
        const newsletterEmails = values.newsletter
          .split(",")
          .map(email => email.trim())
          .filter(email => email.length > 0)

        const newNewsletters: string[] = []

        for (const email of newsletterEmails) {
          if (newsletters.includes(email)) {
            toast.info(`${email} already in your profile`)
            continue
          }

          const { isSuccess: checkSuccess, data: exists } = await checkNewsletterExistsAction(email)
          
          if (!checkSuccess) {
            toast.error(`Failed to check newsletter: ${email}`)
            continue
          }

          if (!exists) {
            const { isSuccess: createSuccess } = await createNewsletterAction(email)
            if (!createSuccess) {
              toast.error(`Failed to create newsletter: ${email}`)
              continue
            }
          }

          newNewsletters.push(email)
        }

        if (newNewsletters.length > 0) {
          const updatedNewsletters = [...newsletters, ...newNewsletters]
          const { isSuccess: updateSuccess, message: updateMessage } = await updateProfileAction(userId, {
            newsletters: updatedNewsletters
          })

          if (updateSuccess) {
            setNewsletters(updatedNewsletters)
            toast.success(`Added ${newNewsletters.length} new newsletter(s)`)
            form.reset({ ...values, newsletter: "" })
          } else {
            toast.error(updateMessage)
          }
        }
      }
    })
  }

  async function handleTestWhatsApp() {
    setIsTestingWhatsApp(true)
    try {
      const response = await fetch("/api/test-whatsapp")
      const data = await response.json()
      
      if (data.success) {
        toast.success("Test WhatsApp message sent successfully!")
      } else {
        toast.error(data.error || "Failed to send test WhatsApp message")
      }
    } catch (error) {
      toast.error("Failed to send test WhatsApp message")
    } finally {
      setIsTestingWhatsApp(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Newsletter</FormLabel>
              <FormControl>
                <Input placeholder="Enter newsletter emails (comma-separated)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <h3 className="font-medium">Your Newsletters</h3>
          <div className="space-y-1">
            {newsletters.map((newsletter, index) => (
              <div key={index} className="text-sm text-muted-foreground">
                {newsletter}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>

          <Button 
            type="button" 
            variant="secondary"
            disabled={isTestingWhatsApp || !initialData?.phone}
            onClick={handleTestWhatsApp}
          >
            {isTestingWhatsApp ? "Sending..." : "Receive first lettercast"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 