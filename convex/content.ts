import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

const contentType = v.union(v.literal("blog"), v.literal("event"), v.literal("listing"), v.literal("partner"), v.literal("token"), v.literal("work"));

async function withUrls(ctx: any, item: any) {
  return {
    ...item,
    coverImageUrl: item.coverImageStorageId ? await ctx.storage.getUrl(item.coverImageStorageId) : null,
    documentUrl: item.documentStorageId ? await ctx.storage.getUrl(item.documentStorageId) : null,
  };
}

export const list = query({
  args: { type: v.optional(contentType) },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("contentItems").collect();
    const filtered = rows
      .filter((item) => item.published && (!args.type || item.type === args.type))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);
    return await Promise.all(filtered.map((item) => withUrls(ctx, item)));
  },
});

export const adminList = query({
  args: { type: v.optional(contentType) },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("contentItems").collect();
    const filtered = rows
      .filter((item) => !args.type || item.type === args.type)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 150);
    return await Promise.all(filtered.map((item) => withUrls(ctx, item)));
  },
});

export const createBooking = mutation({
  args: {
    projectName: v.string(),
    contact: v.string(),
    chainStatus: v.string(),
    mainGoal: v.string(),
    message: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      projectName: args.projectName.trim(),
      contact: args.contact.trim(),
      chainStatus: args.chainStatus.trim(),
      mainGoal: args.mainGoal.trim(),
      message: args.message.trim(),
      source: args.source ?? "website",
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const upsertContent = internalMutation({
  args: {
    id: v.optional(v.id("contentItems")),
    type: contentType,
    title: v.string(),
    summary: v.string(),
    tag: v.optional(v.string()),
    meta: v.optional(v.string()),
    body: v.optional(v.string()),
    href: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    coverImageName: v.optional(v.string()),
    documentStorageId: v.optional(v.id("_storage")),
    documentName: v.optional(v.string()),
    documentType: v.optional(v.string()),
    contentFormat: v.optional(v.string()),
    authorEmail: v.optional(v.string()),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    leads: v.optional(v.number()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const payload = {
      type: args.type,
      title: args.title.trim(),
      summary: args.summary.trim(),
      tag: args.tag?.trim(),
      meta: args.meta?.trim(),
      body: args.body?.trim(),
      href: args.href?.trim(),
      coverImageStorageId: args.coverImageStorageId,
      coverImageName: args.coverImageName?.trim(),
      documentStorageId: args.documentStorageId,
      documentName: args.documentName?.trim(),
      documentType: args.documentType?.trim(),
      contentFormat: args.contentFormat?.trim(),
      authorEmail: args.authorEmail?.trim(),
      impressions: args.impressions ?? 0,
      clicks: args.clicks ?? 0,
      leads: args.leads ?? 0,
      published: args.published ?? true,
      updatedAt: now,
    };

    if (args.id) {
      await ctx.db.patch(args.id, payload);
      return args.id;
    }

    return await ctx.db.insert("contentItems", {
      ...payload,
      createdAt: now,
    });
  },
});
export const deleteContent = internalMutation({
  args: { id: v.id("contentItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const clearContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("contentItems").collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return rows.length;
  },
});

