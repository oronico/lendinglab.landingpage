import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertWaitlistSchema } from "@shared/schema";
import { fireWebhook } from "./services/webhook";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

async function checkRateLimit(ip: string): Promise<boolean> {
  if (ip === "unknown") return true;
  const count = await storage.getRecentSubmissionCount(ip, RATE_LIMIT_WINDOW_MS);
  return count < RATE_LIMIT_MAX;
}

export function checkAdminAuth(req: any): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return false;
  if (authHeader === `Bearer ${adminKey}`) return true;
  if (authHeader.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString();
    const [user, pass] = decoded.split(":");
    return user === "admin" && pass === adminKey;
  }
  return false;
}

function checkAdminKeyParam(req: any): boolean {
  const key = req.query.key || req.headers["x-admin-key"];
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return false;
  return key === adminKey;
}

function isAuthorized(req: any): boolean {
  return checkAdminAuth(req) || checkAdminKeyParam(req);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/health", (_req, res) => {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/leads", async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!(await checkRateLimit(ip))) {
      return res.status(429).json({ message: "Too many submissions. Please try again later." });
    }

    const parsed = insertLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const data = parsed.data;

    if (data.honeypot && data.honeypot.trim() !== "") {
      return res.status(200).json({ message: "Submission received" });
    }

    data.ipAddress = ip;

    const duplicates = await storage.findDuplicates(data.contactEmail, data.schoolName, ip);
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

    const lead = await storage.createLead(data);

    fireWebhook(lead).catch(() => {});

    return res.status(201).json({ id: lead.id, status: lead.status });
  });

  app.get("/api/leads", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { status, handoffStatus } = req.query;
    let allLeads;
    if (status && typeof status === "string") {
      allLeads = await storage.getLeadsByStatus(status);
    } else if (handoffStatus && typeof handoffStatus === "string") {
      allLeads = await storage.getLeadsByHandoffStatus(handoffStatus);
    } else {
      allLeads = await storage.getLeads();
    }
    return res.json(allLeads);
  });

  app.get("/api/leads/stats", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const stats = await storage.getLeadStats();
    return res.json(stats);
  });

  app.get("/api/leads/qualified", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const qualified = await storage.getLeadsByStatus("qualified");
    const pending = qualified.filter(l => l.handoffStatus === "pending");
    return res.json(pending);
  });

  app.get("/api/leads/flagged", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const flagged = await storage.getLeadsByStatus("flagged");
    const pending = flagged.filter(l => l.handoffStatus === "pending");
    return res.json(pending);
  });

  app.get("/api/leads/export", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const allLeads = await storage.getLeads();
    const headers = [
      "id", "submittedAt", "schoolName", "state", "yearsOperating", "entityType",
      "productType", "amountRequested", "termRequested", "revenueRange", "creditRange",
      "contactName", "contactRole", "contactEmail", "contactPhone",
      "status", "riskScore", "handoffStatus", "claimedBy", "claimedAt",
      "attQbo", "attReconciled", "attPayroll", "attBankAccount", "attNoCommingling",
      "attBillsPaid", "attContracts", "attEnrollmentVerification",
      "flags", "hardStops", "dsrResult", "suggestedAmount"
    ];
    const csvRows = [headers.join(",")];
    for (const lead of allLeads) {
      const row = headers.map(h => {
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
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    return res.send(csvRows.join("\n"));
  });

  app.get("/api/leads/:id", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const lead = await storage.getLead(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json(lead);
  });

  app.get("/api/leads/:id/export", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const lead = await storage.getLead(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    const { honeypot, ipAddress, ...exportData } = lead;
    return res.json(exportData);
  });

  app.post("/api/leads/:id/claim", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const claimedBy = req.body?.claimedBy || "admin";
    const lead = await storage.claimLead(req.params.id, claimedBy);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json(lead);
  });

  app.post("/api/leads/:id/handoff", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { handoffStatus } = req.body || {};
    if (!handoffStatus || !["pending", "handed_off", "waitlisted"].includes(handoffStatus)) {
      return res.status(400).json({ message: "Invalid handoff status" });
    }
    const lead = await storage.updateLeadHandoffStatus(req.params.id, handoffStatus);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json(lead);
  });

  app.post("/api/waitlist", async (req, res) => {
    const recentWaitlist = await storage.getRecentWaitlistCount(RATE_LIMIT_WINDOW_MS);
    if (recentWaitlist >= RATE_LIMIT_MAX) {
      return res.status(429).json({ message: "Too many submissions. Please try again later." });
    }

    const parsed = insertWaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const data = parsed.data;
    if (data.honeypot && data.honeypot.trim() !== "") {
      return res.status(200).json({ message: "Submitted" });
    }

    const entry = await storage.createWaitlistEntry(data);
    return res.status(201).json({ id: entry.id });
  });

  app.get("/api/waitlist", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const entries = await storage.getWaitlistEntries();
    return res.json(entries);
  });

  app.post("/api/admin/verify", async (req, res) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json({ authorized: true });
  });

  return httpServer;
}
