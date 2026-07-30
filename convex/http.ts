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


function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

async function sendBookingEmail(body: Record<string, unknown>, id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LAUNCHLAYER_NOTIFY_EMAIL || process.env.LAUNCHLAYER_ADMIN_EMAIL;
  if (!apiKey || !to) return false;

  const from = process.env.LAUNCHLAYER_FROM_EMAIL || "LaunchLayer <hello@launchlayer.solutions>";
  const submittedAt = new Date().toISOString();
  const subject = `New LaunchLayer query: ${String(body.projectName ?? "Token launch")}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:680px;margin:0 auto;background:#f5f5f5;padding:28px;color:#050808">
      <div style="background:#ffffff;border-radius:24px;padding:28px;border:1px solid #e7e7e7">
        <p style="margin:0 0 12px;color:#6b6b6b;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700">LaunchLayer lead</p>
        <h1 style="margin:0 0 20px;font-size:32px;line-height:1.05">${escapeHtml(body.projectName)}</h1>
        <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6">
          <tr><td style="padding:10px 0;color:#777;width:170px">Contact</td><td style="padding:10px 0;font-weight:700">${escapeHtml(body.contact)}</td></tr>
          <tr><td style="padding:10px 0;color:#777">Chain/status</td><td style="padding:10px 0">${escapeHtml(body.chainStatus)}</td></tr>
          <tr><td style="padding:10px 0;color:#777">Main goal</td><td style="padding:10px 0">${escapeHtml(body.mainGoal)}</td></tr>
          <tr><td style="padding:10px 0;color:#777">Booking ID</td><td style="padding:10px 0">${escapeHtml(id)}</td></tr>
          <tr><td style="padding:10px 0;color:#777">Submitted</td><td style="padding:10px 0">${escapeHtml(submittedAt)}</td></tr>
        </table>
        <div style="margin-top:22px;border-radius:18px;background:#ddfb6d;padding:20px">
          <p style="margin:0 0 8px;font-weight:800">Message</p>
          <p style="margin:0;white-space:pre-wrap;line-height:1.65">${escapeHtml(body.message)}</p>
        </div>
      </div>
    </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      ...(isEmail(body.contact) ? { reply_to: String(body.contact).trim() } : {}),
    }),
  });

  if (!response.ok) {
    console.error("Resend email failed", response.status, await response.text());
    return false;
  }
  return true;
}

async function sendClientConfirmation(body: Record<string, unknown>, id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !isEmail(body.contact)) return false;

  const from = process.env.LAUNCHLAYER_FROM_EMAIL || "LaunchLayer <hello@launchlayer.solutions>";
  const replyTo = process.env.LAUNCHLAYER_COMPANY_EMAIL || process.env.LAUNCHLAYER_NOTIFY_EMAIL;
  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <style>
        @media only screen and (max-width:620px){.email-wrap{padding:12px!important}.email-card{padding:24px 20px!important;border-radius:20px!important}.email-title{font-size:30px!important}}
      </style>
    </head>
    <body style="margin:0;padding:0;background:#f2f2f0;color:#090b0a;font-family:Inter,Arial,sans-serif">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0">Your query was submitted successfully. Our team will respond within 48 hours.</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f2f2f0">
        <tr><td class="email-wrap" align="center" style="padding:32px 16px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px">
            <tr><td style="padding:0 4px 18px;font-size:22px;font-weight:800"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:#090b0a;color:#ddfb6d;border-radius:7px;margin-right:9px">L</span>LaunchLayer</td></tr>
            <tr><td class="email-card" style="background:#fff;border:1px solid #dededb;border-radius:28px;padding:36px">
              <p style="margin:0 0 12px;color:#6b6b6b;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700">Query received</p>
              <h1 class="email-title" style="margin:0 0 18px;font-size:42px;line-height:1.04">Your launch is now<br>on our desk.</h1>
              <p style="margin:0;color:#61635f;font-size:17px;line-height:1.7">Hi ${escapeHtml(body.projectName)} team,</p>
              <p style="margin:12px 0 0;color:#61635f;font-size:17px;line-height:1.7">Thanks for reaching out. Your query was submitted successfully and is now with our launch team. Please allow up to 48 hours for us to review your project details and respond with the next steps.</p>
              <div style="margin:28px 0 0;padding:22px;border-radius:20px;background:#ddfb6d">
                <p style="margin:0 0 7px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:800;color:#4f581d">Request reference</p>
                <p style="margin:0;font-size:16px;font-weight:800">${escapeHtml(id)}</p>
                <p style="margin:9px 0 0;font-size:14px;color:#464b30">Goal: ${escapeHtml(body.mainGoal)}</p>
              </div>
              <div style="margin:18px 0 0;padding:16px 18px;border:1px solid #dededb;border-radius:16px"><p style="margin:0;font-size:14px;color:#61635f;line-height:1.6"><strong style="color:#090b0a">What happens next?</strong><br>Our team will review your launch goals and reply to this email within 48 hours.</p></div><p style="margin:28px 0 0;font-size:16px;line-height:1.65">Launch well,<br><strong>LaunchLayer Team</strong></p>
            </td></tr>
            <tr><td style="padding:20px 6px 0;color:#777a76;font-size:12px;line-height:1.6">LaunchLayer · Independent token launch support<br>This message was sent because a launch query was submitted on our website.</td></tr>
          </table>
        </td></tr>
      </table>
    </body>
  </html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: String(body.contact).trim(),
      subject: "Your query was submitted successfully | LaunchLayer",
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    console.error("Resend confirmation failed", response.status, await response.text());
    return false;
  }
  return true;
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
    if (!isEmail(body.contact)) {
      return json({ error: "A valid email address is required" }, { status: 400 });
    }
    const id = await ctx.runMutation(api.content.createBooking, {
      projectName: body.projectName,
      contact: body.contact,
      chainStatus: body.chainStatus,
      mainGoal: body.mainGoal,
      message: body.message,
      source: "launchlayer-contact",
    });
    let emailSent = false;
    let confirmationSent = false;
    try {
      [emailSent, confirmationSent] = await Promise.all([
        sendBookingEmail(body, String(id)),
        sendClientConfirmation(body, String(id)),
      ]);
    } catch (error) {
      console.error("Booking email error", error);
    }
    return json({ ok: true, id, emailSent, confirmationSent });
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

