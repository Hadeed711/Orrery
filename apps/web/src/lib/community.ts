/**
 * Community layer (Phase 7): profiles, posts, people-follows, direct messages.
 * All writes go through the API routes, which authenticate via better-auth
 * sessions and validate with the helpers here. Bodies are stored as plain
 * text and rendered through React (auto-escaped) — never as HTML.
 */
import { getDb } from "@orrery/core";
import {
  dmMessages,
  entities,
  follows,
  posts,
  postLikes,
  profiles,
  user,
  userFollows,
} from "@orrery/core/schema";
import { and, count, desc, eq, inArray, isNull, lt, ne, or, sql } from "drizzle-orm";

// ── validation ──────────────────────────────────────────────────

export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

/** Strip C0 control chars (except tab/newline/CR) and DEL from user text. */
function stripControl(s: string): string {
  let out = "";
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c !== 127)) out += ch;
  }
  return out;
}
const RESERVED = new Set([
  "admin", "orrery", "api", "root", "system", "support", "mod", "moderator",
  "nasa", "official", "help", "about", "settings", "account", "me", "you",
]);

export const AVATARS = ["🪐", "🚀", "🛰️", "🌌", "🌕", "☄️", "🔭", "👩‍🚀", "👨‍🚀", "🌠", "🌍", "🛸"] as const;

export type ProfileInput = {
  username?: unknown;
  displayName?: unknown;
  bio?: unknown;
  location?: unknown;
  website?: unknown;
  avatar?: unknown;
};

/** Returns a cleaned profile patch or a human-readable error string. */
export function validateProfile(input: ProfileInput):
  | { ok: true; patch: Partial<typeof profiles.$inferInsert> }
  | { ok: false; error: string } {
  const patch: Partial<typeof profiles.$inferInsert> = {};

  if (input.username !== undefined) {
    if (typeof input.username !== "string") return { ok: false, error: "Invalid username." };
    const u = input.username.trim().toLowerCase();
    if (!USERNAME_RE.test(u)) {
      return { ok: false, error: "Username must be 3–20 chars: a–z, 0–9, underscore." };
    }
    if (RESERVED.has(u)) return { ok: false, error: "That username is reserved." };
    patch.username = u;
  }
  const text = (v: unknown, max: number, label: string): string | null | undefined => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    if (typeof v !== "string") throw new Error(`Invalid ${label}.`);
    const cleaned = stripControl(v).trim();
    if (cleaned.length > max) throw new Error(`${label} is too long (max ${max} chars).`);
    return cleaned || null;
  };
  try {
    const displayName = text(input.displayName, 50, "Display name");
    if (displayName !== undefined) patch.displayName = displayName;
    const bio = text(input.bio, 280, "Bio");
    if (bio !== undefined) patch.bio = bio;
    const location = text(input.location, 60, "Location");
    if (location !== undefined) patch.location = location;
    const website = text(input.website, 200, "Website");
    if (website !== undefined) {
      if (website !== null && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(website)) {
        return { ok: false, error: "Website must be a valid http(s) URL." };
      }
      patch.website = website;
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid input." };
  }
  if (input.avatar !== undefined) {
    if (typeof input.avatar !== "string" || !(AVATARS as readonly string[]).includes(input.avatar)) {
      return { ok: false, error: "Pick an avatar from the presets." };
    }
    patch.avatar = input.avatar;
  }
  return { ok: true, patch };
}

export function cleanBody(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = stripControl(v).trim();
  if (cleaned.length === 0 || cleaned.length > max) return null;
  return cleaned;
}

// ── profiles ────────────────────────────────────────────────────

export type Profile = typeof profiles.$inferSelect;

/**
 * Every signed-in user gets a profile on first touch: username derived from
 * their email local-part, uniquified with a numeric suffix when taken.
 */
export async function ensureProfile(userId: string, email: string): Promise<Profile> {
  const db = await getDb();
  const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (existing) return existing;

  const base =
    email.split("@")[0]!.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").slice(0, 16) ||
    "explorer";
  const candidate = USERNAME_RE.test(base) && !RESERVED.has(base) ? base : `explorer_${base}`.slice(0, 16);
  for (let attempt = 0; attempt < 20; attempt++) {
    const username =
      attempt === 0
        ? candidate
        : `${candidate.slice(0, 14)}${Math.floor(1000 + Math.random() * 9000)}`;
    if (!USERNAME_RE.test(username)) continue;
    const [row] = await db
      .insert(profiles)
      .values({ userId, username, avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)] })
      .onConflictDoNothing({ target: profiles.username })
      .returning();
    if (row) return row;
    // Username collision — retry; but if OUR user row appeared concurrently, return it.
    const [mine] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    if (mine) return mine;
  }
  throw new Error("Could not allocate a username");
}

export async function profileByUsername(username: string) {
  const db = await getDb();
  const [row] = await db
    .select({ profile: profiles, name: user.name })
    .from(profiles)
    .innerJoin(user, eq(user.id, profiles.userId))
    .where(eq(profiles.username, username.toLowerCase()))
    .limit(1);
  return row ?? null;
}

export async function profileByUserId(userId: string): Promise<Profile | null> {
  const db = await getDb();
  const [row] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return row ?? null;
}

// ── people follows ──────────────────────────────────────────────

export async function followCounts(userId: string) {
  const db = await getDb();
  const [followers] = await db
    .select({ n: count() })
    .from(userFollows)
    .where(eq(userFollows.followingId, userId));
  const [following] = await db
    .select({ n: count() })
    .from(userFollows)
    .where(eq(userFollows.followerId, userId));
  return { followers: followers?.n ?? 0, following: following?.n ?? 0 };
}

export async function isFollowingUser(followerId: string, followingId: string): Promise<boolean> {
  const db = await getDb();
  const [row] = await db
    .select({ f: userFollows.followerId })
    .from(userFollows)
    .where(and(eq(userFollows.followerId, followerId), eq(userFollows.followingId, followingId)))
    .limit(1);
  return Boolean(row);
}

// ── posts ───────────────────────────────────────────────────────

export type PostView = {
  id: string;
  body: string;
  createdAt: Date;
  username: string;
  displayName: string | null;
  avatar: string | null;
  likes: number;
  likedByMe: boolean;
  mine: boolean;
  entityName: string | null;
  entitySlug: string | null;
  entityKind: string | null;
};

const postCols = {
  id: posts.id,
  body: posts.body,
  createdAt: posts.createdAt,
  userId: posts.userId,
  username: profiles.username,
  displayName: profiles.displayName,
  avatar: profiles.avatar,
  entityName: entities.name,
  entitySlug: entities.slug,
  entityKind: entities.kind,
};

async function decorate(rows: Array<Record<string, unknown> & { id: string; userId: string }>, viewerId: string | null): Promise<PostView[]> {
  if (rows.length === 0) return [];
  const db = await getDb();
  const ids = rows.map((r) => r.id);
  const likeRows = await db
    .select({ postId: postLikes.postId, n: count() })
    .from(postLikes)
    .where(inArray(postLikes.postId, ids))
    .groupBy(postLikes.postId);
  const likeMap = new Map(likeRows.map((r) => [r.postId, r.n]));
  const mineLikes = viewerId
    ? await db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(and(inArray(postLikes.postId, ids), eq(postLikes.userId, viewerId)))
    : [];
  const mineSet = new Set(mineLikes.map((r) => r.postId));
  return rows.map((r) => ({
    id: r.id,
    body: r.body as string,
    createdAt: r.createdAt as Date,
    username: r.username as string,
    displayName: (r.displayName as string | null) ?? null,
    avatar: (r.avatar as string | null) ?? null,
    likes: likeMap.get(r.id) ?? 0,
    likedByMe: mineSet.has(r.id),
    mine: viewerId === r.userId,
    entityName: (r.entityName as string | null) ?? null,
    entitySlug: (r.entitySlug as string | null) ?? null,
    entityKind: (r.entityKind as string | null) ?? null,
  }));
}

export async function latestPosts(viewerId: string | null, limit = 40, before?: Date) {
  const db = await getDb();
  const rows = await db
    .select(postCols)
    .from(posts)
    .innerJoin(profiles, eq(profiles.userId, posts.userId))
    .leftJoin(entities, eq(entities.id, posts.entityId))
    .where(before ? lt(posts.createdAt, before) : undefined)
    .orderBy(desc(posts.createdAt))
    .limit(limit);
  return decorate(rows, viewerId);
}

export async function postsByUser(userId: string, viewerId: string | null, limit = 40) {
  const db = await getDb();
  const rows = await db
    .select(postCols)
    .from(posts)
    .innerJoin(profiles, eq(profiles.userId, posts.userId))
    .leftJoin(entities, eq(entities.id, posts.entityId))
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(limit);
  return decorate(rows, viewerId);
}

/** Posts from people the viewer follows — the human half of /feed. */
export async function postsFromFollowedPeople(viewerId: string, limit = 25) {
  const db = await getDb();
  const rows = await db
    .select(postCols)
    .from(posts)
    .innerJoin(userFollows, and(eq(userFollows.followingId, posts.userId), eq(userFollows.followerId, viewerId)))
    .innerJoin(profiles, eq(profiles.userId, posts.userId))
    .leftJoin(entities, eq(entities.id, posts.entityId))
    .orderBy(desc(posts.createdAt))
    .limit(limit);
  return decorate(rows, viewerId);
}

// ── favorites (entity follows) shown on public profiles ─────────

export async function favoritesForUser(userId: string) {
  const db = await getDb();
  return db
    .select({ id: entities.id, kind: entities.kind, slug: entities.slug, name: entities.name })
    .from(follows)
    .innerJoin(entities, eq(entities.id, follows.entityId))
    .where(eq(follows.userId, userId))
    .orderBy(entities.name);
}

// ── direct messages ─────────────────────────────────────────────

export type InboxRow = {
  partnerId: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  lastBody: string;
  lastAt: Date;
  unread: number;
};

export async function inbox(userId: string): Promise<InboxRow[]> {
  const db = await getDb();
  const msgs = await db
    .select({
      id: dmMessages.id,
      senderId: dmMessages.senderId,
      recipientId: dmMessages.recipientId,
      body: dmMessages.body,
      createdAt: dmMessages.createdAt,
      readAt: dmMessages.readAt,
    })
    .from(dmMessages)
    .where(or(eq(dmMessages.senderId, userId), eq(dmMessages.recipientId, userId)))
    .orderBy(desc(dmMessages.createdAt))
    .limit(400);

  const byPartner = new Map<string, { lastBody: string; lastAt: Date; unread: number }>();
  for (const m of msgs) {
    const partner = m.senderId === userId ? m.recipientId : m.senderId;
    const cur = byPartner.get(partner);
    if (!cur) {
      byPartner.set(partner, {
        lastBody: m.body,
        lastAt: m.createdAt,
        unread: m.recipientId === userId && !m.readAt ? 1 : 0,
      });
    } else if (m.recipientId === userId && !m.readAt) {
      cur.unread += 1;
    }
  }
  if (byPartner.size === 0) return [];
  const partnerProfiles = await db
    .select({ userId: profiles.userId, username: profiles.username, displayName: profiles.displayName, avatar: profiles.avatar })
    .from(profiles)
    .where(inArray(profiles.userId, [...byPartner.keys()]));
  const profMap = new Map(partnerProfiles.map((p) => [p.userId, p]));
  return [...byPartner.entries()]
    .map(([partnerId, v]) => {
      const p = profMap.get(partnerId);
      return p
        ? { partnerId, username: p.username, displayName: p.displayName, avatar: p.avatar, ...v }
        : null;
    })
    .filter((r): r is InboxRow => r !== null)
    .sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());
}

/** Full thread between the viewer and a partner; marks incoming as read. */
export async function thread(viewerId: string, partnerId: string, limit = 100) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(dmMessages)
    .where(
      or(
        and(eq(dmMessages.senderId, viewerId), eq(dmMessages.recipientId, partnerId)),
        and(eq(dmMessages.senderId, partnerId), eq(dmMessages.recipientId, viewerId)),
      ),
    )
    .orderBy(desc(dmMessages.createdAt))
    .limit(limit);
  await db
    .update(dmMessages)
    .set({ readAt: sql`now()` })
    .where(
      and(eq(dmMessages.recipientId, viewerId), eq(dmMessages.senderId, partnerId), isNull(dmMessages.readAt)),
    );
  return rows.reverse();
}

export async function unreadCount(userId: string): Promise<number> {
  const db = await getDb();
  const [row] = await db
    .select({ n: count() })
    .from(dmMessages)
    .where(and(eq(dmMessages.recipientId, userId), isNull(dmMessages.readAt), ne(dmMessages.senderId, userId)));
  return row?.n ?? 0;
}

export async function communityStats() {
  const db = await getDb();
  const [members] = await db.select({ n: count() }).from(profiles);
  const [postCount] = await db.select({ n: count() }).from(posts);
  return { members: members?.n ?? 0, posts: postCount?.n ?? 0 };
}
