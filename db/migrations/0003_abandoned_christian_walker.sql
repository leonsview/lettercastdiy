CREATE TABLE IF NOT EXISTS "podcasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"input_text" text NOT NULL,
	"script" text NOT NULL,
	"audio_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
