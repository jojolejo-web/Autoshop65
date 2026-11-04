"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/app/Favoris/action";

type FavoriteButtonProps = {
  productId: number;
  initialIsFavorite: boolean;
  /** icon : carré avec cœur · button : bouton avec texte · link : lien discret */
  appearance?: "icon" | "button" | "link";
  className?: string;
};

export default function FavoriteButton({
  productId,
  initialIsFavorite,
  appearance = "icon",
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { status } = useSession();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resynchronise si le serveur renvoie une nouvelle valeur (après rafraîchissement).
  const [syncedInitial, setSyncedInitial] = useState(initialIsFavorite);
  if (syncedInitial !== initialIsFavorite) {
    setSyncedInitial(initialIsFavorite);
    setIsFavorite(initialIsFavorite);
  }

  useEffect(() => {
    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, []);

  function goToLogin() {
    const current = `${window.location.pathname}${window.location.search}`;
    router.push(`/LogIn?callbackUrl=${encodeURIComponent(current)}`);
  }

  function showError(message: string) {
    setError(message);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => setError(""), 3000);
  }

  function handleClick() {
    if (status === "unauthenticated") {
      goToLogin();
      return;
    }

    const previous = isFavorite;
    setIsFavorite(!previous); // réaction immédiate

    startTransition(async () => {
      try {
        const result = await toggleFavorite(productId);

        if (!result.success) {
          setIsFavorite(previous);
          if (result.requiresLogin) {
            goToLogin();
            return;
          }
          showError(result.message);
          return;
        }

        setIsFavorite(result.isFavorite);
      } catch {
        setIsFavorite(previous);
        showError("Une erreur est survenue, réessayez.");
      }
    });
  }

  const label = isFavorite ? "Retirer des favoris" : "Ajouter aux favoris";
  const heart = (
    <Heart
      aria-hidden="true"
      className={cn(
        "size-4 transition-colors",
        isFavorite && "fill-red-600 text-red-600",
      )}
    />
  );

  return (
    <>
      {error ? (
        <div
          role="alert"
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow"
        >
          {error}
        </div>
      ) : null}

      {appearance === "icon" ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleClick}
          disabled={isPending}
          aria-pressed={isFavorite}
          aria-label={label}
          title={label}
          className={cn(isFavorite && "border-red-200 bg-red-50", className)}
        >
          {heart}
        </Button>
      ) : appearance === "button" ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isPending}
          aria-pressed={isFavorite}
          className={className}
        >
          {heart}
          {isFavorite ? "Dans vos favoris" : "Ajouter aux favoris"}
        </Button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          aria-pressed={isFavorite}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm text-zinc-700 hover:text-red-700 hover:underline disabled:opacity-60",
            className,
          )}
        >
          {heart}
          {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>
      )}
    </>
  );
}
