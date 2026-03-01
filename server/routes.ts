import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/leads", async (req, res) => {
    const parsed = insertLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid lead data", errors: parsed.error.flatten() });
    }

    const data = parsed.data;

    const duplicates = await storage.findDuplicates(
      data.ein,
      data.email,
      data.schoolLegalName
    );

    if (duplicates.length > 0) {
      const existingFlags = Array.isArray(data.flags) ? data.flags : [];
      existingFlags.push("WARNING: Duplicate detected — same EIN, email, or school name already exists in database");
      data.flags = existingFlags;
      if (data.status === "qualified") {
        data.status = "flagged";
      }
    }

    const lead = await storage.createLead(data);
    return res.status(201).json(lead);
  });

  app.get("/api/leads", async (_req, res) => {
    const allLeads = await storage.getLeads();
    return res.json(allLeads);
  });

  app.get("/api/leads/:id", async (req, res) => {
    const lead = await storage.getLead(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json(lead);
  });

  return httpServer;
}
