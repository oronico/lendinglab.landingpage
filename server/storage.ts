import { type Lead, type InsertLead, leads } from "@shared/schema";
import { db } from "./db";
import { desc, eq, or } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  findDuplicates(ein: string, email: string, schoolName: string): Promise<Lead[]>;
}

export class DatabaseStorage implements IStorage {
  async createLead(lead: InsertLead): Promise<Lead> {
    const [result] = await db.insert(leads).values(lead).returning();
    return result;
  }

  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.submittedAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [result] = await db.select().from(leads).where(eq(leads.id, id));
    return result;
  }

  async findDuplicates(ein: string, email: string, schoolName: string): Promise<Lead[]> {
    return db.select().from(leads).where(
      or(
        eq(leads.ein, ein),
        eq(leads.email, email),
        eq(leads.schoolLegalName, schoolName)
      )
    );
  }
}

export const storage = new DatabaseStorage();
