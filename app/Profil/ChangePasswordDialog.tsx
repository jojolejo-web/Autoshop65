"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { changePassword } from "./action";

const fields = [
  { name: "currentPassword", label: "Mot de passe actuel", autoComplete: "current-password" },
  { name: "newPassword", label: "Nouveau mot de passe", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirmez le nouveau mot de passe", autoComplete: "new-password" },
] as const;

type FieldName = (typeof fields)[number]["name"];

const emptyValues: Record<FieldName, string> = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(emptyValues);
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function reset() {
    setValues(emptyValues);
    setShowPasswords(false);
    setError("");
    setLoading(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (values.newPassword !== values.confirmPassword) {
      setError("Les deux nouveaux mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(values);

      if (!result.success) {
        setError(result.message);
        setLoading(false);
        return;
      }
    } catch {
      setError("Une erreur est survenue, veuillez réessayer.");
      setLoading(false);
      return;
    }

    // Toutes les sessions sont révoquées : on reconnecte avec le nouveau mot de passe.
    setValues(emptyValues);
    setDone(true);
    setTimeout(() => {
      void signOut({ callbackUrl: "/LogIn" });
    }, 2500);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (done) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <KeyRound />
          Changer le mot de passe
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogDescription>
            Au moins 8 caractères, avec une lettre et un chiffre. Vous serez
            déconnecté de tous vos appareils après le changement.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <p
            role="status"
            className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            Mot de passe modifié. Vous allez être redirigé vers la page de
            connexion…
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error ? (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            ) : null}

            {fields.map(({ name, label, autoComplete }) => (
              <div key={name} className="space-y-1.5">
                <label htmlFor={`pwd-${name}`} className="text-sm font-medium text-zinc-700">
                  {label}
                </label>
                <input
                  id={`pwd-${name}`}
                  name={name}
                  type={showPasswords ? "text" : "password"}
                  autoComplete={autoComplete}
                  required
                  minLength={name === "currentPassword" ? undefined : 8}
                  maxLength={72}
                  className="w-full rounded-lg border bg-[#f3f3f5] px-4 py-2"
                  value={values[name]}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowPasswords((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-950"
            >
              {showPasswords ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
              {showPasswords ? "Masquer les mots de passe" : "Afficher les mots de passe"}
            </button>

            <DialogFooter className="gap-2 sm:gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
