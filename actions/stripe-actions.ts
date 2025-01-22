/*
<ai_context>
Contains server actions related to Stripe.
</ai_context>
*/

import {
  createProfileAction,
  updateProfileAction,
  updateProfileByStripeCustomerIdAction,
  getProfileAction
} from "@/actions/db/profiles-actions"
import { SelectProfile } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

type MembershipStatus = SelectProfile["membership"]

const getMembershipStatus = (
  subscription: Stripe.Subscription,
  membership: MembershipStatus
): MembershipStatus => {
  const now = new Date()
  const periodEnd = new Date(subscription.current_period_end * 1000)

  // If subscription is active, set to pro
  if (subscription.status === "active") {
    return "pro"
  }

  // If subscription is canceled but still in active period
  if (subscription.cancel_at_period_end && now < periodEnd) {
    return "pro" // Keep pro until period ends
  }

  // For all other cases, revert to free
  return "free"
}

const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"]
  })
}

export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
) => {
  try {
    if (!userId || !subscriptionId || !customerId) {
      console.error("Missing parameters", { userId, subscriptionId, customerId })
      throw new Error("Missing required parameters for updateStripeCustomer")
    }

    console.log("Getting subscription details", { subscriptionId })
    const subscription = await getSubscription(subscriptionId)

    console.log("Checking if profile exists")
    const existingProfile = await getProfileAction(userId)

    if (!existingProfile.isSuccess || !existingProfile.data) {
      console.log("Creating new profile", { userId })
      // Create new profile
      const createResult = await createProfileAction({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        membership: "pro",
        newsletters: [],
        welcomeSent: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      if (!createResult.isSuccess) {
        console.error("Failed to create profile", createResult)
        throw new Error("Failed to create customer profile")
      }

      console.log("Successfully created profile with pro status")
      return createResult.data
    }

    console.log("Updating existing profile", { 
      userId,
      customerId,
      subscriptionId: subscription.id,
      status: "pro"
    })

    // Update existing profile
    const result = await updateProfileAction(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      membership: "pro" // Force pro status on successful checkout
    })

    if (!result.isSuccess) {
      console.error("Failed to update profile", result)
      throw new Error("Failed to update customer profile")
    }

    console.log("Successfully updated customer profile to pro")
    return result.data
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update Stripe customer")
  }
}

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  try {
    if (!subscriptionId || !customerId || !productId) {
      console.error("Missing parameters", { subscriptionId, customerId, productId })
      throw new Error(
        "Missing required parameters for manageSubscriptionStatusChange"
      )
    }

    console.log("Getting subscription details", { subscriptionId })
    const subscription = await getSubscription(subscriptionId)
    
    console.log("Getting product details", { productId })
    const product = await stripe.products.retrieve(productId)
    const membership = product.metadata.membership as MembershipStatus

    if (!["free", "pro"].includes(membership)) {
      console.error("Invalid membership type", { membership })
      throw new Error(
        `Invalid membership type in product metadata: ${membership}`
      )
    }

    const membershipStatus = getMembershipStatus(subscription, membership)
    console.log("Calculated membership status", { membershipStatus })

    console.log("Updating profile by customer ID", { 
      customerId,
      subscriptionId: subscription.id,
      membershipStatus
    })
    const updateResult = await updateProfileByStripeCustomerIdAction(
      customerId,
      {
        stripeSubscriptionId: subscription.id,
        membership: membershipStatus
      }
    )

    if (!updateResult.isSuccess) {
      console.error("Failed to update profile", updateResult)
      throw new Error("Failed to update subscription status")
    }

    console.log("Successfully updated subscription status")
    return membershipStatus
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update subscription status")
  }
}
