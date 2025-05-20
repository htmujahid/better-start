CREATE TABLE "tasks" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"code" varchar(128) NOT NULL,
	"title" varchar(128),
	"status" varchar(30) DEFAULT 'todo' NOT NULL,
	"label" varchar(30) DEFAULT 'bug' NOT NULL,
	"priority" varchar(30) DEFAULT 'low' NOT NULL,
	"estimated_hours" real DEFAULT 0 NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "tasks_code_unique" UNIQUE("code")
);
