"use client";

import { useForm } from "react-hook-form";
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

import { createUser } from "./actions";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function GetStartedForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  async function onSubmit(data) {
    try {
      setError("");

      setLoading(true);
      const result = await createUser(data);
      if (!result.success) {
        setError(result.message);
        return;
      }
      reset();

      router.push("/LogIn");
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>S&apos;inscrire</CardTitle>

          <CardAction>
            <Button
              asChild
              type="button"
              variant="link"
              className="text-red-500"
            >
              <Link href="/LogIn">Se connecter</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="surName">Prenom</Label>
              <Input
                id="surName"
                type="text"
                placeholder="John"
                {...register("surName", {
                  maxLength: 20,
                  minLength: 2,
                  required: true,
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                placeholder="Doe"
                {...register("name", {
                  maxLength: 20,
                  minLength: 2,
                  required: true,
                })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password", {
                  required: true,
                  minLength: 8,
                  maxLength: 30,
                })}
              />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Inscription
              </>
            ) : (
              "S'inscrire"
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
