import { createHash, randomUUID } from "node:crypto";

/* ───────────── Mots de passe ───────────── */

export const PASSWORD_MIN_LENGTH = 8;
// bcrypt ignore tout ce qui dépasse 72 octets : on refuse plutôt que tronquer.
export const PASSWORD_MAX_BYTES = 72;

export function validateNewPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`;
  }
  if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) {
    return "Le mot de passe est trop long (72 caractères maximum)";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre et un chiffre";
  }
  return null;
}

/**
 * Empreinte courte du hash stocké, gardée dans le jeton de session.
 * Si le mot de passe change, l'empreinte ne correspond plus et toutes les
 * sessions ouvertes avec l'ancien mot de passe sont invalidées.
 */
export function passwordFingerprint(passwordHash: string | null | undefined) {
  if (!passwordHash) return "no-password";
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

/* ───────────── Comptes supprimés ───────────── */

const DELETED_EMAIL_DOMAIN = "compte-supprime.invalid";

export function buildDeletedEmail(userId: number) {
  return `supprime-${userId}-${randomUUID()}@${DELETED_EMAIL_DOMAIN}`;
}

export function isDeletedAccountEmail(email: string) {
  return email.endsWith(`@${DELETED_EMAIL_DOMAIN}`);
}

/* ───────────── Limite d'essais ───────────── */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type Attempts = { count: number; resetAt: number };

const globalForLimiter = globalThis as typeof globalThis & {
  accountAttempts?: Map<string, Attempts>;
};
const attempts = (globalForLimiter.accountAttempts ??= new Map());

/** Renvoie le nombre de minutes à attendre si la clé est bloquée, sinon 0. */
export function getLockMinutes(key: string) {
  const entry = attempts.get(key);
  if (!entry) return 0;
  if (Date.now() > entry.resetAt) {
    attempts.delete(key);
    return 0;
  }
  return entry.count >= MAX_ATTEMPTS
    ? Math.ceil((entry.resetAt - Date.now()) / 60000)
    : 0;
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
