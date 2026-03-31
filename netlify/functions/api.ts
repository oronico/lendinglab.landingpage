import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { desc, eq, or, sql, and, gte } from "drizzle-orm";
import { leads, waitlist, insertLeadSchema, insertWaitlistSchema } from "../../shared/schema";
import * as schema from "../../shared/schema";
import crypto from "crypto";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const WAITLIST_RATE_LIMIT_MAX = 50;

let db: ReturnType<typeof drizzle>;
let pool: pg.Pool;

function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
    });
    db = drizzle(pool, { schema });
  }
  return db;
}

function getClientIp(event: HandlerEvent): string {
  return event.headers["x-forwarded-for"]?.split(",")[0]?.trim() || event.headers["client-ip"] || "unknown";
}

async function checkRateLimit(database: ReturnType<typeof drizzle>, ip: string): Promise<boolean> {
  if (ip === "unknown") return true;
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recentLeads = await database.select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(and(eq(leads.ipAddress, ip), gte(leads.submittedAt, windowStart)));
  return Number(recentLeads[0]?.count ?? 0) < RATE_LIMIT_MAX;
}

async function checkWaitlistRateLimit(database: ReturnType<typeof drizzle>, ip: string): Promise<boolean> {
  if (ip === "unknown") return true;
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recent = await database.select({ count: sql<number>`count(*)` })
    .from(waitlist)
    .where(gte(waitlist.createdAt, windowStart));
  return Number(recent[0]?.count ?? 0) < WAITLIST_RATE_LIMIT_MAX;
}

function json(statusCode: number, body: unknown, headers?: Record<string, string>) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  };
}

function checkAuth(event: HandlerEvent): boolean {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return false;

  if (authHeader === `Bearer ${adminKey}`) return true;
  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString();
    const [user, pass] = decoded.split(":");
    return user === "admin" && pass === adminKey;
  }

  const params = new URLSearchParams(event.rawQuery || "");
  const key = params.get("key") || event.headers["x-admin-key"];
  return key === adminKey;
}

async function fireWebhook(lead: schema.Lead): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    event: "lead.created",
    leadId: lead.id,
    schoolName: lead.schoolName,
    state: lead.state,
    productType: lead.productType,
    amountRequested: lead.amountRequested,
    status: lead.status,
    riskScore: lead.riskScore,
    flags: lead.flags,
    submittedAt: lead.submittedAt,
  };

  const body = JSON.stringify(payload);
  const secret = process.env.WEBHOOK_SECRET || "";
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Event": "lead.created",
      },
      body,
    });
  } catch {
  }
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const method = event.httpMethod;
  const path = event.path.replace("/.netlify/functions/api", "").replace("/api", "") || "/";
  const segments = path.split("/").filter(Boolean);

  try {
    const database = getDb();

    if (method === "GET" && path === "/health") {
      return json(200, { status: "ok", timestamp: new Date().toISOString() });
    }

    if (method === "POST" && path === "/waitlist") {
      const ip = getClientIp(event);
      if (!(await checkWaitlistRateLimit(database, ip))) {
        return json(429, { message: "Too many submissions. Please try again later." });
      }
      const body = JSON.parse(event.body || "{}");
      const parsed = insertWaitlistSchema.safeParse(body);
      if (!parsed.success) {
        return json(400, { message: "Invalid data" });
      }
      const data = parsed.data;
      if (data.honeypot && data.honeypot.trim() !== "") {
        return json(200, { message: "Submitted" });
      }
      const [entry] = await database.insert(waitlist).values(data).returning();
      return json(201, { id: entry.id });
    }

    if (method === "POST" && path === "/leads") {
      const ip = getClientIp(event);
      if (!(await checkRateLimit(database, ip))) {
        return json(429, { message: "Too many submissions. Please try again later." });
      }
      const body = JSON.parse(event.body || "{}");
      const parsed = insertLeadSchema.safeParse(body);
      if (!parsed.success) {
        return json(400, { message: "Invalid submission data" });
      }
      const data = parsed.data;
      if (data.honeypot && data.honeypot.trim() !== "") {
        return json(200, { message: "Submission received" });
      }
      data.ipAddress = ip;

      const conditions = [
        eq(leads.contactEmail, data.contactEmail),
        eq(leads.schoolName, data.schoolName),
      ];
      if (ip !== "unknown") {
        conditions.push(eq(leads.ipAddress, ip));
      }
      const duplicates = await database.select().from(leads).where(or(...conditions));

      if (duplicates.length > 0) {
        const existingFlags = Array.isArray(data.flags) ? [...data.flags] : [];
        const ipMatch = duplicates.some(d => d.ipAddress === ip);
        const emailMatch = duplicates.some(d => d.contactEmail === data.contactEmail);
        const schoolMatch = duplicates.some(d => d.schoolName === data.schoolName);
        if (ipMatch) {
          existingFlags.push("Multiple submissions from the same address. Prior application on file.");
        } else if (emailMatch || schoolMatch) {
          existingFlags.push("Duplicate detected. Same email or school name already exists.");
        }
        data.flags = existingFlags;
        if (data.status === "qualified") {
          data.status = "flagged";
        }
      }

      const [lead] = await database.insert(leads).values(data).returning();
      fireWebhook(lead).catch(() => {});
      return json(201, { id: lead.id, status: lead.status });
    }

    if (method === "GET" && path === "/leads/stats") {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const allLeads = await database.select().from(leads);
      const wlResult = await database.select({ count: sql<number>`count(*)` }).from(waitlist);
      const waitlistCount = Number(wlResult[0]?.count ?? 0);
      return json(200, {
        total: allLeads.length,
        qualified: allLeads.filter(l => l.status === "qualified").length,
        flagged: allLeads.filter(l => l.status === "flagged").length,
        ineligible: allLeads.filter(l => l.status === "ineligible").length,
        handedOff: allLeads.filter(l => l.handoffStatus === "handed_off").length,
        waitlisted: waitlistCount,
      });
    }

    if (method === "GET" && path === "/leads/export") {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const allLeads = await database.select().from(leads).orderBy(desc(leads.submittedAt));
      const csvHeaders = [
        "id", "submittedAt", "schoolName", "state", "yearsOperating", "entityType",
        "productType", "amountRequested", "termRequested", "revenueRange", "creditRange",
        "contactName", "contactRole", "contactEmail", "contactPhone",
        "status", "riskScore", "handoffStatus", "claimedBy", "claimedAt",
        "attQbo", "attReconciled", "attPayroll", "attBankAccount", "attNoCommingling",
        "attBillsPaid", "attContracts", "attEnrollmentVerification",
        "flags", "hardStops", "dsrResult", "suggestedAmount"
      ];
      const csvRows = [csvHeaders.join(",")];
      for (const lead of allLeads) {
        const row = csvHeaders.map(h => {
          const val = (lead as any)[h];
          if (val === null || val === undefined) return "";
          if (Array.isArray(val)) return `"${val.join("; ")}"`;
          if (val instanceof Date) return val.toISOString();
          const str = String(val);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        csvRows.push(row.join(","));
      }
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=leads.csv",
        },
        body: csvRows.join("\n"),
      };
    }

    if (method === "GET" && path === "/leads/qualified") {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const qualified = await database.select().from(leads).where(eq(leads.status, "qualified")).orderBy(desc(leads.submittedAt));
      return json(200, qualified.filter(l => l.handoffStatus === "pending"));
    }

    if (method === "GET" && path === "/leads/flagged") {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const flagged = await database.select().from(leads).where(eq(leads.status, "flagged")).orderBy(desc(leads.submittedAt));
      return json(200, flagged.filter(l => l.handoffStatus === "pending"));
    }

    if (method === "GET" && path === "/leads") {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const params = new URLSearchParams(event.rawQuery || "");
      const status = params.get("status");
      const handoffStatus = params.get("handoffStatus");
      let result;
      if (status) {
        result = await database.select().from(leads).where(eq(leads.status, status)).orderBy(desc(leads.submittedAt));
      } else if (handoffStatus) {
        result = await database.select().from(leads).where(eq(leads.handoffStatus, handoffStatus)).orderBy(desc(leads.submittedAt));
      } else {
        result = await database.select().from(leads).orderBy(desc(leads.submittedAt));
      }
      return json(200, result);
    }

    if (method === "GET" && segments[0] === "leads" && segments.length === 2) {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const [result] = await database.select().from(leads).where(eq(leads.id, segments[1]));
      if (!result) return json(404, { message: "Lead not found" });
      return json(200, result);
    }

    if (method === "GET" && segments[0] === "leads" && segments[2] === "export" && segments.length === 3) {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const [result] = await database.select().from(leads).where(eq(leads.id, segments[1]));
      if (!result) return json(404, { message: "Lead not found" });
      const { honeypot, ipAddress, ...exportData } = result;
      return json(200, exportData);
    }

    if (method === "POST" && segments[0] === "leads" && segments[2] === "claim" && segments.length === 3) {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const body = JSON.parse(event.body || "{}");
      const claimedBy = body.claimedBy || "admin";
      const [result] = await database.update(leads)
        .set({ handoffStatus: "handed_off", claimedAt: new Date(), claimedBy })
        .where(eq(leads.id, segments[1]))
        .returning();
      if (!result) return json(404, { message: "Lead not found" });
      return json(200, result);
    }

    if (method === "POST" && segments[0] === "leads" && segments[2] === "handoff" && segments.length === 3) {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const body = JSON.parse(event.body || "{}");
      const { handoffStatus } = body;
      if (!handoffStatus || !["pending", "handed_off", "waitlisted"].includes(handoffStatus)) {
        return json(400, { message: "Invalid handoff status" });
      }
      const [result] = await database.update(leads)
        .set({ handoffStatus })
        .where(eq(leads.id, segments[1]))
        .returning();
      if (!result) return json(404, { message: "Lead not found" });
      return json(200, result);
    }

    if (method === "GET" && path === "/waitlist") {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      const entries = await database.select().from(waitlist).orderBy(desc(waitlist.createdAt));
      return json(200, entries);
    }

    if (method === "POST" && path === "/admin/verify") {
      if (!checkAuth(event)) return json(401, { message: "Unauthorized" });
      return json(200, { authorized: true });
    }

    return json(404, { message: "Not found" });
  } catch (error: any) {
    console.error("API error:", error);
    return json(500, { message: "Internal server error" });
  }
};

export { handler };
