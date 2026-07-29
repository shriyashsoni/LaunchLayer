import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();
const contentTypes = ["blog", "event", "listing", "partner", "token", "work"] as const;
type ContentType = (typeof contentTypes)[number];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-launchlayer-admin-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

function adminToken(request: Request) {
  const token = request.headers.get("x-launchlayer-admin-key");
  const adminKey = process.env.LAUNCHLAYER_ADMIN_KEY;
  return Boolean(adminKey && token === adminKey);
}

function allowedEmail(email: string) {
  return email.trim().toLowerCase() === (process.env.LAUNCHLAYER_ADMIN_EMAIL ?? "").trim().toLowerCase();
}

function parseType(type: string | null): ContentType | null {
  if (!type) return null;
  return (contentTypes as readonly string[]).includes(type) ? (type as ContentType) : null;
}

http.route({
  path: "/content",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const type = parseType(url.searchParams.get("type"));
    if (url.searchParams.get("type") && !type) return json({ error: "Invalid content type" }, { status: 400 });
    const items = await ctx.runQuery(api.content.list, type ? { type } : {});
    return json({ items });
  }),
});

http.route({
  path: "/booking",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const required = ["projectName", "contact", "chainStatus", "mainGoal", "message"];
    for (const key of required) {
      if (typeof body[key] !== "string" || body[key].trim().length < 2) {
        return json({ error: `${key} is required` }, { status: 400 });
      }
    }
    const id = await ctx.runMutation(api.content.createBooking, {
      projectName: body.projectName,
      contact: body.contact,
      chainStatus: body.chainStatus,
      mainGoal: body.mainGoal,
      message: body.message,
      source: "launchlayer-contact",
    });
    return json({ ok: true, id });
  }),
});

http.route({
  path: "/admin/login",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    const body = await request.json();
    const password = process.env.LAUNCHLAYER_ADMIN_PASSWORD;
    const adminKey = process.env.LAUNCHLAYER_ADMIN_KEY;
    if (!password || !adminKey || typeof body.email !== "string" || typeof body.password !== "string") {
      return json({ error: "Admin login is not configured" }, { status: 401 });
    }
    if (!allowedEmail(body.email) || body.password !== password) {
      return json({ error: "Invalid admin login" }, { status: 401 });
    }
    return json({ ok: true, token: adminKey, email: body.email.trim().toLowerCase() });
  }),
});

http.route({
  path: "/admin/upload-url",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!adminToken(request)) return json({ error: "Unauthorized" }, { status: 401 });
    return json({ uploadUrl: await ctx.storage.generateUploadUrl() });
  }),
});

http.route({
  path: "/admin/content",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!adminToken(request)) return json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const type = parseType(url.searchParams.get("type"));
    if (url.searchParams.get("type") && !type) return json({ error: "Invalid content type" }, { status: 400 });
    const items = await ctx.runQuery(api.content.adminList, type ? { type } : {});
    return json({ items });
  }),
});

http.route({
  path: "/admin/content",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!adminToken(request)) return json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (!allowedEmail(String(body.authorEmail ?? ""))) {
      return json({ error: "Only the LaunchLayer admin email can publish" }, { status: 401 });
    }
    const id = await ctx.runMutation(internal.content.upsertContent, body);
    return json({ ok: true, id });
  }),
});

http.route({
  path: "/admin/content/delete",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!adminToken(request)) return json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (typeof body.id !== "string") return json({ error: "Content id is required" }, { status: 400 });
    const id = await ctx.runMutation(internal.content.deleteContent, { id: body.id });
    return json({ ok: true, id });
  }),
});

http.route({
  path: "/admin/content/clear",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!adminToken(request)) return json({ error: "Unauthorized" }, { status: 401 });
    const count = await ctx.runMutation(internal.content.clearContent, {});
    return json({ ok: true, count });
  }),
});

for (const path of ["/content", "/booking", "/admin/login", "/admin/upload-url", "/admin/content", "/admin/content/delete", "/admin/content/clear"]) {
  http.route({
    path,
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
  });
}

export default http;
