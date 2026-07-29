import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contentItems: defineTable({
    type: v.union(v.literal("blog"), v.literal("event"), v.literal("listing"), v.literal("partner"), v.literal("token"), v.literal("work")),
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
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_published", ["published"]),

  bookings: defineTable({
    projectName: v.string(),
    contact: v.string(),
    chainStatus: v.string(),
    mainGoal: v.string(),
    message: v.string(),
    source: v.string(),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("archived")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),
});
