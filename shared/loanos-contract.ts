import type { Lead } from "./schema";

export type WebhookEvent = "lead.created";

export interface WebhookPayload {
  event: WebhookEvent;
  leadId: string;
  schoolName: string;
  state: string;
  productType: string;
  amountRequested: number;
  status: string;
  riskScore: number | null;
  flags: string[] | null;
  submittedAt: string;
}

export type PublicLead = Omit<Lead, "honeypot" | "ipAddress">;

export interface ClaimRequest {
  claimedBy: string;
}

export type ClaimResponse = Lead;

export type QualifiedLeadsResponse = PublicLead[];

export type FlaggedLeadsResponse = PublicLead[];

export interface WebhookHeaders {
  "Content-Type": "application/json";
  "X-Webhook-Signature": string;
  "X-Webhook-Event": WebhookEvent;
}
