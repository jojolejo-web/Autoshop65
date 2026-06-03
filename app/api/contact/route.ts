import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  renderContactEmailTemplate,
  renderContactEmailText,
} from "@/app/components/ContactEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY manquante dans .env" },
        { status: 500 },
      );
    }

    if (!process.env.CONTACT_FROM_EMAIL || !process.env.CONTACT_TO_EMAIL) {
      return NextResponse.json(
        {
          error: "Une erreur est survenu",
        },
        { status: 500 },
      );
    }

    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 },
      );
    }

    if (
      name.length < 2 ||
      name.length > 40 ||
      email.length > 80 ||
      phone.length > 16 ||
      subject.length > 60 ||
      message.length < 10 ||
      message.length > 1500
    ) {
      return NextResponse.json(
        { error: "Les informations du formulaire sont invalides" },
        { status: 400 },
      );
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL!,
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: email,
      subject: `Contact site: ${subject}`,
      html: renderContactEmailTemplate({
        name,
        email,
        phone,
        subject,
        message,
      }),
      text: renderContactEmailText({
        name,
        email,
        phone,
        subject,
        message,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message ?? "Erreur Resend" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}
