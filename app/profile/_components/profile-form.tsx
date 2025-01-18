"use client"

import { useTransition } from "react"
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
      
      // If phone number was added/changed, try to send WhatsApp welcome message
      if (phoneChanged) {
        const { isSuccess: whatsappSuccess, message: whatsappMessage } = await sendWhatsAppWelcomeAction(values.phone)
        if (!whatsappSuccess) {
          toast.error(whatsappMessage)
        }
      }

      // Handle newsletter updates if any
      if (values.newsletter) {
        // Split newsletter input by commas and trim whitespace
        const newsletterEmails = values.newsletter
          .split(",")
          .map(email => email.trim())
          .filter(email => email.length > 0) // Remove empty entries

        const currentNewsletters = initialData?.newsletters || []
        const newNewsletters: string[] = []

        // Process each newsletter email
        for (const email of newsletterEmails) {
          // Skip if already in user's profile
          if (currentNewsletters.includes(email)) {
            toast.info(`${email} already in your profile`)
            continue
          }

          // Check if newsletter exists in database
          const { isSuccess: checkSuccess, data: exists } = await checkNewsletterExistsAction(email)
          
          if (!checkSuccess) {
            toast.error(`Failed to check newsletter: ${email}`)
            continue
          }

          if (!exists) {
            // Create new newsletter entry
            const { isSuccess: createSuccess } = await createNewsletterAction(email)
            if (!createSuccess) {
              toast.error(`Failed to create newsletter: ${email}`)
              continue
            }
          }

          newNewsletters.push(email)
        }

        // Update profile with new newsletters if any were added
        if (newNewsletters.length > 0) {
          const { isSuccess: updateSuccess, message: updateMessage } = await updateProfileAction(userId, {
            newsletters: [...currentNewsletters, ...newNewsletters]
          })

          if (updateSuccess) {
            toast.success(`Added ${newNewsletters.length} new newsletter(s)`)
            form.reset({ ...values, newsletter: "" })
          } else {
            toast.error(updateMessage)
          }
        }
      }
    })
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
            {initialData?.newsletters?.map((newsletter, index) => (
              <div key={index} className="text-sm text-muted-foreground">
                {newsletter}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
} 