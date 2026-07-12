CREATE TYPE "public"."edge_rel" AS ENUM('orbits', 'moon_of', 'part_of', 'carries', 'observed', 'discovered_by', 'operated_by', 'built_by', 'launched_on', 'launched_from', 'used_vehicle', 'member_of', 'flew_on', 'successor_of', 'targets', 'involves', 'mentions');--> statement-breakpoint
CREATE TYPE "public"."entity_kind" AS ENUM('object', 'mission', 'spacecraft', 'launch', 'vehicle', 'engine', 'pad', 'site', 'agency', 'company', 'person', 'instrument', 'telescope', 'observatory', 'event', 'gear_product', 'club', 'place');--> statement-breakpoint
CREATE TYPE "public"."event_kind" AS ENUM('moon_phase', 'solar_eclipse', 'lunar_eclipse', 'meteor_shower', 'meteor_peak', 'conjunction', 'opposition', 'elongation', 'perigee_syzygy', 'equinox_solstice', 'launch_window', 'milestone');--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY NOT NULL,
	"entity_id" uuid NOT NULL,
	"field" text NOT NULL,
	"value" jsonb NOT NULL,
	"source_id" uuid,
	"confidence" real DEFAULT 1 NOT NULL,
	"retrieved_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "edges" (
	"id" uuid PRIMARY KEY NOT NULL,
	"src_id" uuid NOT NULL,
	"rel" "edge_rel" NOT NULL,
	"dst_id" uuid NOT NULL,
	"attrs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_id" uuid
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"kind" "entity_kind" NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"summary" text,
	"attrs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"completeness" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "events_astro" (
	"entity_id" uuid PRIMARY KEY NOT NULL,
	"event_kind" "event_kind" NOT NULL,
	"peak_at" timestamp with time zone NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"magnitude" real,
	"visibility" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"computed_by" text NOT NULL,
	"computed_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_ids" (
	"entity_id" uuid NOT NULL,
	"system" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "launches" (
	"entity_id" uuid PRIMARY KEY NOT NULL,
	"ll2_id" text,
	"status" text NOT NULL,
	"net" timestamp with time zone,
	"window_start" timestamp with time zone,
	"window_end" timestamp with time zone,
	"webcast_url" text,
	"net_history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"synced_at" timestamp with time zone NOT NULL,
	CONSTRAINT "launches_ll2_id_unique" UNIQUE("ll2_id")
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"homepage" text,
	"tier" integer DEFAULT 3 NOT NULL,
	"license" text,
	"poll_secs" integer,
	"last_success_at" timestamp with time zone,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "sources_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_src_id_entities_id_fk" FOREIGN KEY ("src_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_dst_id_entities_id_fk" FOREIGN KEY ("dst_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events_astro" ADD CONSTRAINT "events_astro_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_ids" ADD CONSTRAINT "external_ids_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launches" ADD CONSTRAINT "launches_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "claims_entity_field" ON "claims" USING btree ("entity_id","field");--> statement-breakpoint
CREATE UNIQUE INDEX "edges_src_rel_dst" ON "edges" USING btree ("src_id","rel","dst_id");--> statement-breakpoint
CREATE INDEX "edges_src_rel" ON "edges" USING btree ("src_id","rel");--> statement-breakpoint
CREATE INDEX "edges_dst_rel" ON "edges" USING btree ("dst_id","rel");--> statement-breakpoint
CREATE UNIQUE INDEX "entities_kind_slug" ON "entities" USING btree ("kind","slug");--> statement-breakpoint
CREATE INDEX "entities_kind" ON "entities" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "events_peak" ON "events_astro" USING btree ("peak_at");--> statement-breakpoint
CREATE INDEX "events_kind_peak" ON "events_astro" USING btree ("event_kind","peak_at");--> statement-breakpoint
CREATE UNIQUE INDEX "external_ids_system_value" ON "external_ids" USING btree ("system","value");--> statement-breakpoint
CREATE INDEX "external_ids_entity" ON "external_ids" USING btree ("entity_id");