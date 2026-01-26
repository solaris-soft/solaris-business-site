import type { APIRoute } from "astro";
import { Resend } from "resend";

const requiredFields = [
  "name",
  "email",
  "role",
  "company",
  "workflow",
  "friction",
  "outcome",
  "successMetrics",
  "users",
  "constraints",
  "timeline",
] as const;

const sanitize = (value: unknown, maxLength = 2000) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const payload = await request.json();
    const websiteTrap = sanitize(payload.website, 200);
    if (websiteTrap) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const data = Object.fromEntries(
      requiredFields.map((field) => [field, sanitize(payload[field])]),
    ) as Record<(typeof requiredFields)[number], string>;

    const budget = sanitize(payload.budget, 500);

    const missing = requiredFields.filter((field) => !data[field]);
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({ error: "Please complete all required fields." }),
        { status: 400 },
      );
    }

    if (!isValidEmail(data.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400,
      });
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const toEmail = import.meta.env.LEADS_TO_EMAIL;
    const fromEmail = import.meta.env.LEADS_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
      return new Response(
        JSON.stringify({ error: "Lead email service not configured." }),
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);

    const subject = `New inquiry from ${data.name} (${data.company})`;
    const summaryLines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Role: ${data.role}`,
      `Company: ${data.company}`,
      "",
      "Current workflow and tools:",
      data.workflow,
      "",
      "Where the friction shows up:",
      data.friction,
      "",
      "Desired outcome:",
      data.outcome,
      "",
      "How success is measured:",
      data.successMetrics,
      "",
      "Primary users or stakeholders:",
      data.users,
      "",
      "Constraints or integrations:",
      data.constraints,
      "",
      "Timeline or urgency:",
      data.timeline,
      "",
      `Budget range: ${budget || "Not provided"}`,
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
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Unable to process inquiry." }),
      { status: 500 },
    );
  }
};
