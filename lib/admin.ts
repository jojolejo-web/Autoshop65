import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export function isAdminEmail(email?: string | null) {
  const adminEmail = getAdminEmail();

  if (!email || !adminEmail) {
    return false;
  }

  return email.trim().toLowerCase() === adminEmail;
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  return session;
}
