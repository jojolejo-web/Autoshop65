import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") ??
      process.env.NEXTAUTH_URL ??
      "http://localhost:3000";

    //regarder si article en stock
    const hasInvalidStock = cart.items.some(
      (item) => item.quantity > item.product.stock || item.product.stock <= 0,
    );

    if (hasInvalidStock) {
      return NextResponse.json(
        { error: "Un ou plusieurs articles ne sont plus disponibles en stock" },
        { status: 400 },
      );
    }

    //calcul total prix
    const lineItems: NonNullable<
      Parameters<typeof stripe.checkout.sessions.create>[0]
    >["line_items"] = cart.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: item.product.price,
        product_data: {
          name: item.product.productName,
          description: item.product.productDescription ?? undefined,
        },
      },
    }));

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
    //les order

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "pending",
        totalAmount: totalAmount,
      },
    });

    await prisma.orderItem.createMany({
      data: cart.items.map((item) => ({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        productNameSnapshot: item.product.productName,
      })),
    });
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        orderId: order.id,
        status: "pending",
        amount: totalAmount,
        currency: "eur",
        provider: "stripe",
      },
    });
    //creation de la session

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        orderId: String(order.id),
        userId: String(user.id),
      },
      success_url: `${origin}/Cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/Cart?checkout=cancel`,
    });

    //enregistre le stripe session
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: checkoutSession.id,
      },
    });
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        stripeSessionId: checkoutSession.id,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "URL Stripe introuvable" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur Stripe" }, { status: 500 });
  }
}
