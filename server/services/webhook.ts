import type { Lead } from "@shared/schema";
import crypto from "crypto";

export async function fireWebhook(lead: Lead): Promise<void> {
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

  const attempt = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": "lead.created",
        },
        body,
        signal: controller.signal,
      });
      if (!res.ok) {
        console.log(`Webhook delivery failed: ${res.status}`);
        return false;
      }
      console.log(`Webhook delivered successfully for lead ${lead.id}`);
      return true;
    } catch {
      console.log(`Webhook delivery error for lead ${lead.id}`);
      return false;
    } finally {
      clearTimeout(timeout);
    }
  };

  const success = await attempt();
  if (!success) {
    setTimeout(async () => {
      await attempt();
    }, 5000);
  }
}
