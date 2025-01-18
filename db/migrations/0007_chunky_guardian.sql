CREATE TABLE IF NOT EXISTS "content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"newsletter-email-id" text NOT NULL,
	"newsletter_name" text,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "todos";--> statement-breakpoint
ALTER TABLE "newsletters" ALTER COLUMN "subscribed" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "newsletters" ADD COLUMN "name" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content" ADD CONSTRAINT "content_newsletter-email-id_newsletters_newsletter-email-id_fk" FOREIGN KEY ("newsletter-email-id") REFERENCES "public"."newsletters"("newsletter-email-id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
