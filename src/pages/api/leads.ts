import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

const leadBodySchema = z.object({
  website: z.string().max(200).optional(),
  name: z.string().trim().min(1, "Name is required.").max(500),
  email: z.string().trim().email("Invalid email address."),
  role: z.string().trim().max(2000).optional().default(""),
  company: z.string().trim().max(2000).optional().default(""),
  workflow: z.string().trim().max(2000).optional().default(""),
  friction: z.string().trim().max(2000).optional().default(""),
  outcome: z.string().trim().max(2000).optional().default(""),
  successMetrics: z.string().trim().max(2000).optional().default(""),
  users: z.string().trim().max(2000).optional().default(""),
  constraints: z.string().trim().max(2000).optional().default(""),
  timeline: z.string().trim().max(2000).optional().default(""),
  budget: z.string().trim().max(500).optional().default(""),
});

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  try {
    const raw = await request.json();
    const websiteTrap =
      typeof raw?.website === "string" && raw.website.trim().length > 0;
    if (websiteTrap) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const parsed = leadBodySchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      const message = first?.message ?? "Please complete all required fields.";
      return new Response(JSON.stringify({ error: message }), { status: 400 });
    }

    const data = parsed.data;

    const env = locals.runtime?.env;
    const apiKey = env?.RESEND_API_KEY;
    const toEmail = env?.LEADS_TO_EMAIL;
    const fromEmail = env?.LEADS_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
      return new Response(
        JSON.stringify({ error: "Lead email service not configured." }),
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const opt = (val: string) => (val ? val : "(Not provided)");

    const subject = `New inquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`;
    const summaryLines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Role: ${opt(data.role)}`,
      `Company: ${opt(data.company)}`,
      "",
      "Current workflow and tools:",
      opt(data.workflow),
      "",
      "Where the friction shows up:",
      opt(data.friction),
      "",
      "Desired outcome:",
      opt(data.outcome),
      "",
      "How success is measured:",
      opt(data.successMetrics),
      "",
      "Primary users or stakeholders:",
      opt(data.users),
      "",
      "Constraints or integrations:",
      opt(data.constraints),
      "",
      "Timeline or urgency:",
      opt(data.timeline),
      "",
      `Budget range: ${data.budget ? opt(data.budget) : "Not provided"}`,
      "",
      `IP: ${clientAddress || "Unavailable"}`,
    ];

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: data.email,
      subject,
      text: summaryLines.join("\n"),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(
      JSON.stringify({ error: "Unable to process inquiry." }),
      { status: 500 },
    );
  }
};
