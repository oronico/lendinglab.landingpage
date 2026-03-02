import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  schoolName: text("school_name").notNull(),
  state: text("state").notNull(),
  yearsOperating: text("years_operating").notNull(),
  entityType: text("entity_type").notNull(),
  website: text("website"),

  productType: text("product_type").notNull(),
  amountRequested: integer("amount_requested").notNull(),
  termRequested: integer("term_requested"),

  attQbo: boolean("att_qbo").notNull(),
  attReconciled: boolean("att_reconciled").notNull(),
  attPayroll: boolean("att_payroll").notNull(),
  attBankAccount: boolean("att_bank_account").notNull(),
  attNoCommingling: boolean("att_no_commingling").notNull(),
  attBillsPaid: boolean("att_bills_paid").notNull(),
  attContracts: boolean("att_contracts").notNull(),
  attEnrollmentVerification: boolean("att_enrollment_verification").notNull(),

  revenueRange: text("revenue_range").notNull(),
  creditRange: text("credit_range").notNull(),

  contactName: text("contact_name").notNull(),
  contactRole: text("contact_role"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),

  honeypot: text("honeypot"),

  flags: text("flags").array(),
  hardStops: text("hard_stops").array(),
  status: text("status").notNull().default("qualified"),
  riskScore: integer("risk_score"),
  dsrResult: text("dsr_result"),
  suggestedAmount: integer("suggested_amount"),

  handoffStatus: text("handoff_status").notNull().default("pending"),
  claimedAt: timestamp("claimed_at"),
  claimedBy: text("claimed_by"),

  applicationStartedAt: timestamp("application_started_at"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const waitlist = pgTable("waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  schoolName: text("school_name").notNull(),
  productInterest: text("product_interest"),
  honeypot: text("honeypot"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  submittedAt: true,
  claimedAt: true,
  claimedBy: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlist.$inferSelect;
