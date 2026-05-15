"use server";

import { z } from "zod";
import { Resend } from "resend";
import { env } from "../../lib/env";
import { getSiteSettings } from "../../lib/sanity/queries";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(120),
  email: z.string().email("Email tidak valid"),
  subject: z.string().min(2, "Subjek minimal 2 karakter").max(200),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(5000),
});

export type ContactFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof schema>, string>>;
};

export async function sendContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof schema> | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, error: "Periksa kembali isi form.", fieldErrors };
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return {
      ok: false,
      error: "Layanan email belum dikonfigurasi.",
    };
  }

  const settings = await getSiteSettings().catch(() => null);
  const recipient = settings?.contactEmail;
  if (!recipient) {
    return {
      ok: false,
      error: "Alamat tujuan belum diatur di Sanity (siteSettings.contactEmail).",
    };
  }

  const { name, email, subject, message } = parsed.data;
  const resend = new Resend(env.RESEND_API_KEY);

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #0a0807; color: #ece6d8;">
      <h2 style="font-family: 'Cinzel', serif; letter-spacing: 0.18em; text-transform: uppercase; color: #b08d57;">New contact message</h2>
      <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr style="border: 0; border-top: 1px solid #221c19; margin: 16px 0;" />
      <p style="white-space: pre-wrap; line-height: 1.7;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: [recipient],
      replyTo: email,
      subject: `[Aethernoir] ${subject}`,
      html,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    });
    if (error) {
      return { ok: false, error: error.message || "Gagal mengirim email." };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
