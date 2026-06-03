"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Car,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function ContactPage() {
  const SUBJECTS = [
    "Demande de pièce",
    "Disponibilité d'un article",
    "Retrait de colis",
    "Suivi de commande",
    "Devis",
    "Autre",
  ];

  const [submitted, setSubmitted] = useState(false);
  const [wait, setWait] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    if (error) {
      setError("");
    }

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setWait(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'envoi");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      setError("Impossible d'envoyer le message pour le moment.");
    } finally {
      setWait(false);
    }
  }

  return (
    <main className="container mx-auto px-16 py-12 ">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card className="border-l-4 border-l-red-600 ">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="shrink-0 rounded-full bg-red-600 p-3 text-white">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Téléphone</p>
                <p className="mt-1 text-lg font-bold text-red-600">
                  05 62 95 21 75
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Lundi au Vendredi, 8h - 18h
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="shrink-0 rounded-full bg-red-600 p-3 text-white">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <Link
                  href="mailto:autoshop65600@hotmail.com"
                  className="mt-1 break-all font-bold text-red-600 hover:underline"
                >
                  autoshop65600@hotmail.com
                </Link>
                <p className="mt-1 text-sm text-gray-500">Réponse sous 24 h</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="shrink-0 rounded-full bg-red-600 p-3 text-white">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Adresse</p>
                <p className="mt-1 text-gray-700">86 Av. François Mitterrand</p>
                <p className="text-gray-700">65600 Séméac</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="shrink-0 rounded-full bg-red-600 p-3 text-white">
                <Clock className="size-5" />
              </div>
              <div className="w-full">
                <p className="mb-3 font-semibold text-gray-900">
                  Horaires d&apos;ouverture
                </p>
                <div className="space-y-1 text-sm">
                  {[
                    { day: "Lundi - Vendredi", hours: "8h00 - 18h00" },
                    { day: "Samedi - Dimanche", hours: "Fermé" },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between gap-4">
                      <span className="text-gray-600">{day}</span>
                      <span
                        className={
                          hours === "Fermé"
                            ? "font-medium text-red-500"
                            : "font-medium text-gray-900"
                        }
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-black text-white">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="shrink-0 rounded-full bg-red-600 p-3">
                <Car className="size-5 text-white" />
              </div>
              <div>
                <p className="font-bold">Locker 24h/24</p>
                <p className="mt-1 text-sm text-gray-300">
                  Retrait de colis disponible à toute heure gràce à notre
                  Locker automatique.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="p-0 lg:col-span-2">
          <CardHeader className="bg-red-600 p-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Send className="size-5" />
              Envoyer un message
            </CardTitle>
            <CardDescription className="text-red-100">
              Remplissez le formulaire, nous vous répondons dans les meilleurs
              délais.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                
                <h2 className="text-2xl font-bold text-gray-900">
                  Message envoyé !
                </h2>
                <p className="max-w-sm text-gray-600">
                  Merci pour votre message. Notre équipe vous contactera dans
                  les 24 heures.
                </p>
                <Button
                  className="mt-4 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                >
                  Nouveau message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nom complet <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jean@exemple.fr"
                      value={form.email}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={form.phone}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Sujet <span className="text-red-600">*</span>
                    </Label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="" disabled>
                        Choisir un sujet
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Décrivez votre demande en détail : référence de la pièce, modéle du véhicule, année"
                    value={form.message}
                    onChange={handleChange}
                    className="resize-none border-gray-300 focus:border-red-600 focus:ring-red-600"
                  />
                  <p className="text-xs text-gray-400">
                    Précisez la marque, le modéle et l&apos;année de votre
                    véhicule pour une réponse plus rapide.
                  </p>
                </div>

                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={wait}
                  className="flex w-full items-center justify-center gap-2 bg-red-600 py-3 text-base font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {wait ? (
                    <>
                      <Spinner/>  Envoi en cours
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.2914988564503!2d0.09939377597843467!3d43.22434767112568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a9d353127102e5%3A0xdf57f9d71d01179c!2sStation%20Saint%20Christophe!5e0!3m2!1sfr!2sfr!4v1776839483888!5m2!1sfr!2sfr"
                  className="mt-3 h-full w-full rounded-lg text-sm font-medium text-white"
                >
                  Voir sur Google Maps
                </iframe>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
