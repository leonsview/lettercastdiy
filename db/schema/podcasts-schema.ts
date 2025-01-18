// schema.ts
import { 
    pgTable, 
    serial, 
    text, 
    timestamp,
    uuid 
  } from 'drizzle-orm/pg-core';
  
  export const podcasts = pgTable('podcasts', {
    id: serial('id').primaryKey(),
    userId: text("user_id").notNull(),          // Reference to the user who the podcast is for
    inputText: text('input_text'),    // Original input text
    script: text('script'),           // Generated conversation script
    audioUrl: text('audio_url'),      // URL to the audio file in Supabase storage
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  });

  export type InsertPodcast = typeof podcasts.$inferInsert
  export type SelectPodcast = typeof podcasts.$inferSelect
