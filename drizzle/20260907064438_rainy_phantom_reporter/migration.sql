CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
