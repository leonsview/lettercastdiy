ALTER TABLE "newsletters" RENAME COLUMN "newsletter-email-id" TO "newsletter_email_id";--> statement-breakpoint
ALTER TABLE "content" RENAME COLUMN "newsletter-email-id" TO "newsletter_email_id";--> statement-breakpoint
ALTER TABLE "content" DROP CONSTRAINT "content_newsletter-email-id_newsletters_newsletter-email-id_fk";
--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_newsletter_email_id_newsletters_newsletter_email_id_fk" FOREIGN KEY ("newsletter_email_id") REFERENCES "public"."newsletters"("newsletter_email_id") ON DELETE cascade ON UPDATE no action;