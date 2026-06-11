const DEFAULT_ADMIN_EMAILS = [
  "autoshop65600@hotmail.com",
];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseAdminEmails(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

export function getAdminEmails() {
  const adminEmails = [
    ...DEFAULT_ADMIN_EMAILS,
    ...parseAdminEmails(process.env.ADMIN_EMAILS),
    ...parseAdminEmails(process.env.ADMIN_EMAIL),
  ];

  return Array.from(new Set(adminEmails));
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(normalizeEmail(email));
}
