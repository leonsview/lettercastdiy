CREATE TABLE IF NOT EXISTS "newsletters" (
	"newsletter-email-id" text PRIMARY KEY NOT NULL,
	"subscribed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
