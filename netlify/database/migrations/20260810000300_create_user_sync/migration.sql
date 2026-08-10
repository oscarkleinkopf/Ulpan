CREATE TABLE "user_sync" (
	"user_id" text PRIMARY KEY,
	"progress" jsonb DEFAULT '{}' NOT NULL,
	"classroom" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
