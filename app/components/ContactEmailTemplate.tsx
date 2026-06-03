type ContactEmailTemplateProps = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMultiline(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function field(label: string, value: string) {
  return `
    <div style="margin:0 0 16px;">
      <span style="display:block;margin-bottom:4px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#6b7280;">
        ${label}
      </span>
      <p style="margin:0;padding:12px 14px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;line-height:1.6;">
        ${value}
      </p>
    </div>
  `;
}

export function renderContactEmailTemplate({
  name,
  email,
  phone,
  subject,
  message,
}: ContactEmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <body style="margin:0;padding:24px;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="max-width:640px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background-color:#dc2626;padding:24px;color:#ffffff;">
            <p style="margin:0 0 8px;font-size:12px;opacity:0.9;">Nouveau message de contact</p>
            <h1 style="margin:0;font-size:28px;line-height:1.2;">Autoshop 65</h1>
          </div>

          <div style="padding:24px;">
            <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;">Details du message</h2>
            ${field("Nom", escapeHtml(name))}
            ${field("Email", escapeHtml(email))}
            ${field("Telephone", escapeHtml(phone?.trim() ? phone : "Non renseigne"))}
            ${field("Sujet", escapeHtml(subject))}
            ${field("Message", formatMultiline(message))}
          </div>
        </div>
      </body>
    </html>
  `;
}

export function renderContactEmailText({
  name,
  email,
  phone,
  subject,
  message,
}: ContactEmailTemplateProps) {
  return [
    "Nouveau message de contact - Autoshop 65",
    "",
    `Nom: ${name}`,
    `Email: ${email}`,
    `Telephone: ${phone?.trim() ? phone : "Non renseigne"}`,
    `Sujet: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

export type { ContactEmailTemplateProps };
