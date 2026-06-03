"use client";

import { useState, useTransition } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckoutButtonProps = {
  disabled?: boolean;
};

export default function CheckoutButton({
  disabled = false,
}: CheckoutButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
        });

        const data = (await response.json()) as { error?: string; url?: string };

        if (!response.ok || !data.url) {
          setError(data.error ?? "Impossible de lancer le paiement");
          return;
        }

        window.location.href = data.url;
      } catch {
        setError("Impossible de lancer le paiement");
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        variant="destructive"
        type="button"
        onClick={handleCheckout}
        disabled={disabled || isPending}
      >
        <ShoppingCart />
        {isPending ? "Redirection..." : "Acheter maintenant"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
