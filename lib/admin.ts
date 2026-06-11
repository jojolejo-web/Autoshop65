import { authOptions } from "@/auth";
import { isAdminEmail } from "@/lib/admin-emails";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  return session;
}
