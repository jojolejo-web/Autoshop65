"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { addToCart } from "./action";

type AddToCartResult =
  | { success: false; message: string }
  | { success: true; cartItem: unknown; productId: number };

type AddToCartActionProps = {
  productId: number;
  children: ReactNode;
  className?: string;
  buttonClassName?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
};

type ButtonState = "idle" | "loading" | "success";

export default function AddToCartAction({
  productId,
  children,
  className,
  buttonClassName,
  variant = "destructive",
}: AddToCartActionProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const successTimeout = timeoutRef.current;
    const alertTimeout = alertTimeoutRef.current;

    return () => {
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    setState("loading");

    try {
      const [result] = await Promise.all([
        addToCart(productId) as Promise<AddToCartResult>,
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if (!result.success) {
        setAlert({ type: "error", message: result.message });
        setState("idle");
        alertTimeoutRef.current = setTimeout(() => {
          setAlert(null);
        }, 3000);
        return;
      }
      setAlert({ type: "success", message: "Produit ajoute au panier" });
      setState("success");
      timeoutRef.current = setTimeout(() => {
        setState("idle");
      }, 1400);
      alertTimeoutRef.current = setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch {
      setAlert({
        type: "error",
        message: "Une erreur inattendue est survenue",
      });
      setState("idle");
      alertTimeoutRef.current = setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {alert ? (
        <div
          className={cn(
            "fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md px-4 py-3 text-sm shadow",
            alert.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700",
          )}
        >
          {alert.message}
        </div>
      ) : null}
      <form action={handleSubmit} className="relative z-10">
        <Button
          className={cn(
            "transition-all duration-200",
            state === "loading" && "scale-[0.99]",
            state === "success" && "scale-[1.02]",
            buttonClassName,
          )}
          variant={variant}
        >
          {state === "idle" ? children : null}
          {state === "loading" ? (
            <>
              <Spinner />
              Ajout...
            </>
          ) : null}
          {state === "success" ? (
            <>
              <Check />
              Ajoute au panier
            </>
          ) : null}
        </Button>
      </form>
    </div>
  );
}
