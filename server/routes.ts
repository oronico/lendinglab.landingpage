import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";

const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipSubmissions = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipSubmissions.get(ip);
  if (!entry || now > entry.resetAt) {
    ipSubmissions.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function checkAdminAuth(req: any): boolean {
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/leads", async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkRateLimit(ip)) {
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

    const duplicates = await storage.findDuplicates(data.contactEmail, data.schoolName);
    if (duplicates.length > 0) {
      const existingFlags = Array.isArray(data.flags) ? [...data.flags] : [];
      existingFlags.push("Duplicate detected — same email or school name already exists");
      data.flags = existingFlags;
      if (data.status === "qualified") {
        data.status = "flagged";
      }
    }

    const lead = await storage.createLead(data);
    return res.status(201).json({ id: lead.id, status: lead.status });
  });

  app.get("/api/leads", async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const allLeads = await storage.getLeads();
    return res.json(allLeads);
  });

  app.get("/api/leads/:id", async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const lead = await storage.getLead(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json(lead);
  });

  return httpServer;
}
