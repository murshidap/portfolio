import type { APIRoute } from "astro";

import { forbiddenResponse, getPublicServerSupabase, isSameOriginAdminRequest } from "@/lib/server/auth";

const maxFieldLengths = {
  fullName: 120,
  contactNumber: 40,
  email: 254,
  company: 160,
  message: 4000
} as const;

function isValidField(value: unknown, maxLength: number, required: boolean) {
  return typeof value === "string" && value.trim().length <= maxLength && (!required || value.trim().length > 0);
}

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOriginAdminRequest(request)) {
    return forbiddenResponse();
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return new Response(JSON.stringify({ error: "Invalid enquiry." }), { status: 400 });
  }

  const enquiry = payload as Record<string, unknown>;
  const { fullName, contactNumber, email, company, message } = enquiry;
  if (
    !isValidField(fullName, maxFieldLengths.fullName, true) ||
    !isValidField(contactNumber, maxFieldLengths.contactNumber, true) ||
    !isValidField(email, maxFieldLengths.email, true) ||
    !isValidField(company, maxFieldLengths.company, false) ||
    !isValidField(message, maxFieldLengths.message, true) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
  ) {
    return new Response(JSON.stringify({ error: "Please provide valid contact details and a message." }), { status: 400 });
  }

  const supabase = getPublicServerSupabase();
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Enquiry submission is not configured." }), { status: 500 });
  }

  const { error } = await supabase.from("enquiries").insert({
    full_name: String(fullName).trim(),
    contact_number: String(contactNumber).trim(),
    email: String(email).trim(),
    company: String(company).trim() || null,
    message: String(message).trim()
  });
  if (error) {
    return new Response(JSON.stringify({ error: "Your message could not be saved. Please try again later." }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 201 });
};
