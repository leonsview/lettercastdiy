import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const newslettersTable = pgTable("newsletters", {
  newsletteremailid: text("newsletter-email-id").primaryKey().notNull(),
  name: text("name"),
  subscribed: boolean("subscribed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertNewsletter = typeof newslettersTable.$inferInsert
export type SelectNewsletter = typeof newslettersTable.$inferSelect 