/*
<ai_context>
Defines the database schema for profiles.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", ["free", "pro"])

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  firstName: text("first_name"),
  email: text("email"),
  phone: text("phone"),
  membership: membershipEnum("membership").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  newsletters: text("newsletters").array(),
  lastWelcomedPhone: text("last_welcomed_phone"),
  welcomeSent: boolean("welcome_sent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect
