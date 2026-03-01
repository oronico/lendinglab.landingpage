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

  schoolLegalName: text("school_legal_name").notNull(),
  dba: text("dba"),
  schoolWebsite: text("school_website").notNull(),
  state: text("state").notNull(),
  entityType: text("entity_type").notNull(),
  taxClassification: text("tax_classification"),
  ein: text("ein").notNull(),
  schoolYear: text("school_year").notNull(),
  schoolType: text("school_type"),
  networkAffiliation: text("network_affiliation"),

  boardCoApplicantName: text("board_co_applicant_name"),
  boardCoApplicantEmail: text("board_co_applicant_email"),
  boardCoApplicantPhone: text("board_co_applicant_phone"),
  totalBoardMembers: integer("total_board_members"),
  independentBoardMembers: integer("independent_board_members"),

  projectedEnrollment: integer("projected_enrollment").notNull(),
  tuitionContracts: integer("tuition_contracts").notNull(),
  enrollmentDeposits: integer("enrollment_deposits"),
  tuitionPerStudent: integer("tuition_per_student").notNull(),
  calculatedRevenue: integer("calculated_revenue").notNull(),
  revenueSources: text("revenue_sources"),
  waitlistCount: integer("waitlist_count"),
  retentionRate: integer("retention_rate"),
  priorYearEnrollment: integer("prior_year_enrollment"),

  parentRefName: text("parent_ref_name").notNull(),
  parentRefEmail: text("parent_ref_email").notNull(),
  parentRefPhone: text("parent_ref_phone").notNull(),
  boardRefName: text("board_ref_name").notNull(),
  boardRefEmail: text("board_ref_email").notNull(),
  boardRefPhone: text("board_ref_phone").notNull(),

  facilityType: text("facility_type").notNull(),
  facilityStatus: text("facility_status").notNull(),
  leaseExpiry: text("lease_expiry"),
  monthlyFacilityPayment: integer("monthly_facility_payment"),
  maxCapacity: integer("max_capacity"),
  fireInspection: text("fire_inspection"),
  fireInspectionDate: text("fire_inspection_date"),
  certificateOfOccupancy: text("certificate_of_occupancy"),
  insuranceStatus: text("insurance_status").notNull(),
  residentialDwelling: text("residential_dwelling").notNull(),
  stateRegistration: text("state_registration"),

  bookkeepingTool: text("bookkeeping_tool").notNull(),
  hasBalanceSheet: boolean("has_balance_sheet"),
  hasPnL: boolean("has_pnl"),
  hasCashForecast: boolean("has_cash_forecast"),
  hasYTD: boolean("has_ytd"),
  hasTaxReturn: boolean("has_tax_return"),
  personalFinancialStatement: text("personal_financial_statement"),
  financialModel: text("financial_model").notNull(),
  positiveNetIncome: text("positive_net_income").notNull(),
  leaderReceivingSalary: text("leader_receiving_salary"),
  rentUtilitiesCurrent: text("rent_utilities_current"),
  payrollMethod: text("payroll_method").notNull(),
  fundsCommingled: text("funds_commingled").notNull(),
  outstandingLoans: text("outstanding_loans").notNull(),
  debtCovenants: text("debt_covenants"),
  hasArticlesOfIncorp: text("has_articles_of_incorp"),
  hasDeterminationLetter: text("has_determination_letter"),

  loanAmount: integer("loan_amount").notNull(),
  projectedRevenue: integer("projected_revenue").notNull(),
  useOfFunds: text("use_of_funds").notNull(),

  flags: text("flags").array(),
  status: text("status").notNull().default("qualified"),

  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  submittedAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
