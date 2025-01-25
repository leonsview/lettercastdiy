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
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectProfile } from "@/db/schema"
import { updateProfileAction } from "@/actions/db/profiles-actions"
import { checkNewsletterExistsAction, createNewsletterAction } from "@/actions/db/newsletters-actions"
import { sendWhatsAppWelcomeAction } from "@/actions/whatsapp-actions"
import { X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

interface ProfileFormProps {
  userId?: string
  initialData?: SelectProfile
}

interface FormValues {
  firstName: string
  email: string
  phone: string
  newsletter: string
}

export default function ProfileForm({ userId = "default", initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [newsletters, setNewsletters] = useState<string[]>(initialData?.newsletters || [])

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

        // Check if adding new newsletters would exceed the limit
        if (newsletters.length + newsletterEmails.length > 15) {
          toast.error("You can only add up to 15 newsletters")
          return
        }

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

  async function handleDeleteNewsletter(newsletterToDelete: string) {
    startTransition(async () => {
      const updatedNewsletters = newsletters.filter(n => n !== newsletterToDelete)
      const { isSuccess, message } = await updateProfileAction(userId, {
        newsletters: updatedNewsletters
      })

      if (isSuccess) {
        setNewsletters(updatedNewsletters)
        toast.success("Newsletter removed successfully")
      } else {
        toast.error(message)
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
                <Input placeholder="Enter your WhatsAppphone number in international format" {...field} />
              </FormControl>
              <FormDescription>
                Your WhatsApp phone number in international format, e.g.: +49 1520 3977304
                <br />
                In case you don't receive a welcome message after saving the changes, please double check your phone number.
              </FormDescription>
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
              <FormDescription>
                Just copy and paste the email adresses of the newsletters you want to subscribe to.
                <br />
                e.g.: therundownai@mail.beehiiv.com, hi@ainauten.com
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <h3 className="font-medium">Your Newsletters</h3>
          <div className="text-sm text-muted-foreground mb-2">
            {newsletters.length}/15 newsletters used ({15 - newsletters.length} remaining)
          </div>
          <div className="space-y-1">
            {newsletters.map((newsletter, index) => (
              <div key={index} className="flex items-center justify-between group">
                <span className="text-sm text-muted-foreground">{newsletter}</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {newsletter} from your newsletters.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteNewsletter(newsletter)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 