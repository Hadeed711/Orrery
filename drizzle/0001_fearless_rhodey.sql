CREATE TABLE "article_entities" (
	"article_id" uuid NOT NULL,
	"entity_id" uuid NOT NULL,
	"salience" real DEFAULT 0.5 NOT NULL,
	"matched_by" text NOT NULL,
	CONSTRAINT "article_entities_article_id_entity_id_pk" PRIMARY KEY("article_id","entity_id")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"source_id" uuid NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"image_url" text,
	"lang" text DEFAULT 'en' NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dedupe_key" text,
	CONSTRAINT "articles_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "entity_aliases" (
	"entity_id" uuid NOT NULL,
	"alias" text NOT NULL,
	"lang" text DEFAULT 'en' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_entities" ADD CONSTRAINT "article_entities_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_entities" ADD CONSTRAINT "article_entities_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_aliases" ADD CONSTRAINT "entity_aliases_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_entities_entity" ON "article_entities" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "articles_published" ON "articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "articles_dedupe" ON "articles" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "articles_fts" ON "articles" USING gin (to_tsvector('english', "title" || ' ' || coalesce("excerpt", '')));--> statement-breakpoint
CREATE UNIQUE INDEX "entity_aliases_entity_alias" ON "entity_aliases" USING btree ("entity_id","alias");--> statement-breakpoint
CREATE INDEX "entity_aliases_alias" ON "entity_aliases" USING btree ("alias");--> statement-breakpoint
CREATE INDEX "entities_fts" ON "entities" USING gin (to_tsvector('english', "name" || ' ' || coalesce("summary", '')));