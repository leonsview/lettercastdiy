import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { newslettersTable } from "./newsletters-schema"

export const contentTable = pgTable("content", {
  id: uuid("id").defaultRandom().primaryKey(),
  newsletterEmailId: text("newsletter-email-id")
    .references(() => newslettersTable.newsletteremailid, { onDelete: "cascade" })
    .notNull(),
  subject_line: text("subject_line"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertContent = typeof contentTable.$inferInsert
export type SelectContent = typeof contentTable.$inferSelect 