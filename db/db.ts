/*
<ai_context>
Initializes the database connection and schema for the app.
</ai_context>
*/

import { profilesTable, podcasts, newslettersTable, contentTable } from "@/db/schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

config({ path: ".env.local" })

const schema = {
  profiles: profilesTable,
  podcasts: podcasts,
  newsletters: newslettersTable,
  content: contentTable
}

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client, { schema })
