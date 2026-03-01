import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  schoolName: text("school_name").notNull(),
  state: text("state").notNull(),
  entityType: text("entity_type").notNull(),
  operatingYears: text("operating_years").notNull(),
  nonprofitGuarantee: text("nonprofit_guarantee"),
  annualRevenue: integer("annual_revenue").notNull(),
  existingDebt: integer("existing_debt").notNull(),
  monthlyBreakevenKnown: text("monthly_breakeven_known").notNull(),
  loanAmount: integer("loan_amount").notNull(),
  hasFacility: text("has_facility").notNull(),
  enrollmentSize: text("enrollment_size").notNull(),
  loanPurpose: text("loan_purpose").notNull(),
  qualified: boolean("qualified").notNull(),
  rejectionReasons: text("rejection_reasons").array(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  submittedAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
