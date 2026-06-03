"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const [error, setError] = useState("");

  async function onSubmit(data) {
    setError("");
    
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    reset();
    router.push(result?.url ?? "/");
  }

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>

          <CardAction>
            <Button type="button" variant="link" className="text-red-500">
              <Link href="/GetStarted">S&apos;inscrire</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-col gap-6">
            
            

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", {required:true})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password", {required: true,min:8, max:30})}
              />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" variant="destructive" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                Connexion
              </>
            ) : (
              "Connexion"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Se connecter avec Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
