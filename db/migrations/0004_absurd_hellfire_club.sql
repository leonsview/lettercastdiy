ALTER TABLE "podcasts" ALTER COLUMN "input_text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "podcasts" ALTER COLUMN "script" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "podcasts" ALTER COLUMN "audio_url" DROP NOT NULL;