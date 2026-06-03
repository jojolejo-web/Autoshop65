"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <button type="button" onClick={() => signOut()}>
        Se deconnecter
      </button>
    );
  }

  return (
    <button type="button" onClick={() => signIn("google")}>
      Se connecter avec Google
    </button>
  );
}
