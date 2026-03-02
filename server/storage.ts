import { type Lead, type InsertLead, leads, type WaitlistEntry, type InsertWaitlistEntry, waitlist } from "@shared/schema";
import { db } from "./db";
import { desc, eq, or, sql, and } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadsByStatus(status: string): Promise<Lead[]>;
  getLeadsByHandoffStatus(handoffStatus: string): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  findDuplicates(email: string, schoolName: string): Promise<Lead[]>;
  claimLead(id: string, claimedBy: string): Promise<Lead | undefined>;
  updateLeadHandoffStatus(id: string, handoffStatus: string): Promise<Lead | undefined>;
  getLeadStats(): Promise<{ total: number; qualified: number; flagged: number; ineligible: number; handedOff: number; waitlisted: number }>;

  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async createLead(lead: InsertLead): Promise<Lead> {
    const [result] = await db.insert(leads).values(lead).returning();
    return result;
  }

  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.submittedAt));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.status, status)).orderBy(desc(leads.submittedAt));
  }

  async getLeadsByHandoffStatus(handoffStatus: string): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.handoffStatus, handoffStatus)).orderBy(desc(leads.submittedAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [result] = await db.select().from(leads).where(eq(leads.id, id));
    return result;
  }

  async findDuplicates(email: string, schoolName: string): Promise<Lead[]> {
    return db.select().from(leads).where(
      or(
        eq(leads.contactEmail, email),
        eq(leads.schoolName, schoolName)
      )
    );
  }

  async claimLead(id: string, claimedBy: string): Promise<Lead | undefined> {
    const [result] = await db.update(leads)
      .set({ handoffStatus: "handed_off", claimedAt: new Date(), claimedBy })
      .where(eq(leads.id, id))
      .returning();
    return result;
  }

  async updateLeadHandoffStatus(id: string, handoffStatus: string): Promise<Lead | undefined> {
    const [result] = await db.update(leads)
      .set({ handoffStatus })
      .where(eq(leads.id, id))
      .returning();
    return result;
  }

  async getLeadStats(): Promise<{ total: number; qualified: number; flagged: number; ineligible: number; handedOff: number; waitlisted: number }> {
    const allLeads = await db.select().from(leads);
    const waitlistCount = await this.getWaitlistCount();
    return {
      total: allLeads.length,
      qualified: allLeads.filter(l => l.status === "qualified").length,
      flagged: allLeads.filter(l => l.status === "flagged").length,
      ineligible: allLeads.filter(l => l.status === "ineligible").length,
      handedOff: allLeads.filter(l => l.handoffStatus === "handed_off").length,
      waitlisted: waitlistCount,
    };
  }

  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const [result] = await db.insert(waitlist).values(entry).returning();
    return result;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return db.select().from(waitlist).orderBy(desc(waitlist.createdAt));
  }

  async getWaitlistCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
    return Number(result[0]?.count ?? 0);
  }
}

export const storage = new DatabaseStorage();
