/**
 * The Orrery knowledge graph as Postgres — subset of docs/DATA-MODEL.md.
 * Three graph tables (entities, edges, claims) + registries + typed satellites
 * (launches, events_astro) + news layer (articles, article_entities, entity_aliases)
 * + user layer (better-auth tables, follows, push subscriptions — Phase 6).
 * Deferred to later phases: places, ephem_daily, media_assets, redirects.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

// ── registries (DATA-MODEL §3) ──────────────────────────────────
export const entityKind = pgEnum("entity_kind", [
  "object", "mission", "spacecraft", "launch", "vehicle", "engine", "pad",
  "site", "agency", "company", "person", "instrument", "telescope",
  "observatory", "event", "gear_product", "club", "place",
]);

export const edgeRel = pgEnum("edge_rel", [
  "orbits", "moon_of", "part_of", "carries", "observed", "discovered_by",
  "operated_by", "built_by", "launched_on", "launched_from", "used_vehicle",
  "member_of", "flew_on", "successor_of", "targets", "involves", "mentions",
]);

export const eventKind = pgEnum("event_kind", [
  "moon_phase", "solar_eclipse", "lunar_eclipse", "meteor_shower", "meteor_peak",
  "conjunction", "opposition", "elongation", "perigee_syzygy", "equinox_solstice",
  "launch_window", "milestone",
]);

// ── graph core ──────────────────────────────────────────────────
export const entities = pgTable(
  "entities",
  {
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    kind: entityKind("kind").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    summary: text("summary"),
    attrs: jsonb("attrs").$type<Record<string, unknown>>().notNull().default({}),
    completeness: integer("completeness").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("entities_kind_slug").on(t.kind, t.slug),
    index("entities_kind").on(t.kind),
    // Search v0 (DATA-MODEL §6.5): FTS over name+summary, kind-boosted at query time.
    index("entities_fts").using(
      "gin",
      sql`to_tsvector('english', ${t.name} || ' ' || coalesce(${t.summary}, ''))`,
    ),
  ],
);

/** Alternate names powering news tagging (NEWS-3) and search synonyms (DATA-MODEL §7). */
export const entityAliases = pgTable(
  "entity_aliases",
  {
    entityId: uuid("entity_id").notNull().references(() => entities.id),
    alias: text("alias").notNull(),
    lang: text("lang").notNull().default("en"),
  },
  (t) => [
    uniqueIndex("entity_aliases_entity_alias").on(t.entityId, t.alias),
    index("entity_aliases_alias").on(t.alias),
  ],
);

export const edges = pgTable(
  "edges",
  {
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    srcId: uuid("src_id").notNull().references(() => entities.id),
    rel: edgeRel("rel").notNull(),
    dstId: uuid("dst_id").notNull().references(() => entities.id),
    attrs: jsonb("attrs").$type<Record<string, unknown>>().notNull().default({}),
    sourceId: uuid("source_id").references(() => sources.id),
  },
  (t) => [
    uniqueIndex("edges_src_rel_dst").on(t.srcId, t.rel, t.dstId),
    index("edges_src_rel").on(t.srcId, t.rel),
    index("edges_dst_rel").on(t.dstId, t.rel),
  ],
);

/** Provenance: every displayed fact traces to a claim (PRD ENT-4). */
export const claims = pgTable(
  "claims",
  {
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    entityId: uuid("entity_id").notNull().references(() => entities.id),
    field: text("field").notNull(),
    value: jsonb("value").$type<unknown>().notNull(),
    sourceId: uuid("source_id").references(() => sources.id),
    confidence: real("confidence").notNull().default(1),
    retrievedAt: timestamp("retrieved_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("claims_entity_field").on(t.entityId, t.field)],
);

/** Cross-system identity — the entity-resolution backbone (DATA-MODEL §7). */
export const externalIds = pgTable(
  "external_ids",
  {
    entityId: uuid("entity_id").notNull().references(() => entities.id),
    system: text("system").notNull(), // horizons | norad | ll2 | ll2-agency | ll2-config | ll2-pad | mpc | wikidata | messier | ngc
    value: text("value").notNull(),
  },
  (t) => [
    uniqueIndex("external_ids_system_value").on(t.system, t.value),
    index("external_ids_entity").on(t.entityId),
  ],
);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  homepage: text("homepage"),
  tier: integer("tier").notNull().default(3),
  license: text("license"),
  pollSecs: integer("poll_secs"),
  lastSuccessAt: timestamp("last_success_at", { withTimezone: true }),
  enabled: boolean("enabled").notNull().default(true),
});

// ── typed satellites ────────────────────────────────────────────
export type NetChange = { net: string | null; changedAt: string };

export const launches = pgTable("launches", {
  entityId: uuid("entity_id").primaryKey().references(() => entities.id),
  ll2Id: text("ll2_id").unique(),
  status: text("status").notNull(), // go | tbc | tbd | hold | success | failure | partial
  net: timestamp("net", { withTimezone: true }),
  windowStart: timestamp("window_start", { withTimezone: true }),
  windowEnd: timestamp("window_end", { withTimezone: true }),
  webcastUrl: text("webcast_url"),
  netHistory: jsonb("net_history").$type<NetChange[]>().notNull().default([]),
  raw: jsonb("raw").$type<Record<string, unknown>>().notNull().default({}),
  syncedAt: timestamp("synced_at", { withTimezone: true }).notNull(),
});

export const eventsAstro = pgTable(
  "events_astro",
  {
    entityId: uuid("entity_id").primaryKey().references(() => entities.id),
    eventKind: eventKind("event_kind").notNull(),
    peakAt: timestamp("peak_at", { withTimezone: true }).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    magnitude: real("magnitude"),
    visibility: jsonb("visibility").$type<Record<string, unknown>>().notNull().default({}),
    computedBy: text("computed_by").notNull(),
    computedAt: timestamp("computed_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    index("events_peak").on(t.peakAt),
    index("events_kind_peak").on(t.eventKind, t.peakAt),
  ],
);

// ── news layer (DATA-MODEL: articles + materialized mentions) ───
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    sourceId: uuid("source_id").notNull().references(() => sources.id),
    url: text("url").notNull().unique(), // canonicalized
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    imageUrl: text("image_url"),
    lang: text("lang").notNull().default("en"),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    ingestedAt: timestamp("ingested_at", { withTimezone: true }).notNull().defaultNow(),
    dedupeKey: text("dedupe_key"), // normalized-title hash grouping (NEWS-2)
  },
  (t) => [
    index("articles_published").on(t.publishedAt),
    index("articles_dedupe").on(t.dedupeKey),
    index("articles_fts").using(
      "gin",
      sql`to_tsvector('english', ${t.title} || ' ' || coalesce(${t.excerpt}, ''))`,
    ),
  ],
);

// ── user layer (Phase 6) ────────────────────────────────────────
// user/session/account/verification follow better-auth's core model shapes
// (text ids generated by the auth library, not uuidv7).
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("session_user").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("account_user").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Follow any entity → personalized feed + weekly digest (PRD Phase 6). */
export const follows = pgTable(
  "follows",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.entityId] }),
    index("follows_entity").on(t.entityId),
  ],
);

/** One row per browser push registration (Web Push / VAPID). */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    prefs: jsonb("prefs").$type<{ launches?: boolean; events?: boolean }>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("push_subscriptions_user").on(t.userId)],
);

/** Dedupe ledger so a subscription is alerted once per (thing, alert stage). */
export const pushSent = pgTable(
  "push_sent",
  {
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => pushSubscriptions.id, { onDelete: "cascade" }),
    alertKey: text("alert_key").notNull(), // e.g. "launch:<entityId>:t15"
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.subscriptionId, t.alertKey] })],
);

/** Weekly-digest ledger — one row per user per ISO week actually emailed. */
export const digestSent = pgTable(
  "digest_sent",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    weekKey: text("week_key").notNull(), // e.g. "2026-W29"
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.weekKey] })],
);

// ── community layer (Phase 7) ───────────────────────────────────
// People are followable; entities are favorited (the `follows` table above is
// the favorites backend — it keeps powering feed/alerts/digest unchanged).

/** Public identity a user builds on top of their auth record. */
export const profiles = pgTable(
  "profiles",
  {
    userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(), // ^[a-z0-9_]{3,20}$, reserved names enforced in app
    displayName: text("display_name"),
    bio: text("bio"),
    location: text("location"),
    website: text("website"),
    avatar: text("avatar"), // emoji glyph from the preset picker
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

/** Short text posts about space; optional link into the graph. */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(), // 1..1000 chars, plain text
    entityId: uuid("entity_id").references(() => entities.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("posts_user").on(t.userId), index("posts_created").on(t.createdAt)],
);

export const postLikes = pgTable(
  "post_likes",
  {
    postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] }), index("post_likes_user").on(t.userId)],
);

/** Person→person follow (entities are favorited, people are followed). */
export const userFollows = pgTable(
  "user_follows",
  {
    followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    index("user_follows_following").on(t.followingId),
  ],
);

/** Direct messages; a conversation is the (sender, recipient) pair in either direction. */
export const dmMessages = pgTable(
  "dm_messages",
  {
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    senderId: text("sender_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(), // 1..2000 chars, plain text
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  (t) => [
    index("dm_sender_recipient_created").on(t.senderId, t.recipientId, t.createdAt),
    index("dm_recipient_read").on(t.recipientId, t.readAt),
  ],
);

/** Materialized `mentions` edges — kept out of `edges` because of news volume. */
export const articleEntities = pgTable(
  "article_entities",
  {
    articleId: uuid("article_id").notNull().references(() => articles.id),
    entityId: uuid("entity_id").notNull().references(() => entities.id),
    salience: real("salience").notNull().default(0.5),
    matchedBy: text("matched_by").notNull(), // 'alias-dict@v0' | 'reviewer'
  },
  (t) => [
    primaryKey({ columns: [t.articleId, t.entityId] }),
    index("article_entities_entity").on(t.entityId),
  ],
);
