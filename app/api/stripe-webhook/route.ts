import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Recupere la commande cible depuis les metadata Stripe par order id
async function getOrderFromSession(session: Stripe.Checkout.Session) {
  const orderId = Number(session.metadata?.orderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return null;
  }

  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: {
        include: {
          cart: {
            include: {
              items: true,
            },
          },
        },
      },
    },
  });
}

// Finalise la commande une seule fois apres confirmation Stripe.
async function finalizePaidOrder(session: Stripe.Checkout.Session) {
  const order = await getOrderFromSession(session);

  if (!order) {
    throw new Error("Commande Stripe introuvable");
  }

  if (order.status === "paid") {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findFirst({
      where: {
        id: order.id,
        status: "pending",
      },
      include: {
        items: true,
        user: {
          include: {
            cart: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    });

    if (!currentOrder) {
      return;
    }

    for (const item of currentOrder.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });

      if (!product || product.stock < item.quantity) {
        throw new Error("Stock insuffisant pour finaliser la commande");
      }
    }

    const updatedOrder = await tx.order.updateMany({
      where: {
        id: currentOrder.id,
        status: "pending",
      },
      data: {
        status: "paid",
        stripeSessionId: session.id,
      },
    });

    if (updatedOrder.count === 0) {
      return;
    }

    await tx.transaction.updateMany({
      where: {
        orderId: currentOrder.id,
        status: "pending",
      },
      data: {
        status: "succeeded",
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent
          ? String(session.payment_intent)
          : null,
      },
    });

    for (const item of currentOrder.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    if (currentOrder.user.cart) {
      for (const item of currentOrder.items) {
        const cartItem = currentOrder.user.cart.items.find(
          (cartEntry) => cartEntry.productId === item.productId,
        );

        if (!cartItem) {
          continue;
        }

        if (cartItem.quantity <= item.quantity) {
          await tx.cartItem.delete({
            where: { id: cartItem.id },
          });
          continue;
        }

        await tx.cartItem.update({
          where: { id: cartItem.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }
  });
}

// Marque la transaction et la commande comme annulees si la session expire.
async function cancelExpiredOrder(session: Stripe.Checkout.Session) {
  const orderId = Number(session.metadata?.orderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: {
        id: orderId,
        status: "pending",
      },
      data: {
        status: "cancelled",
      },
    });

    await tx.transaction.updateMany({
      where: {
        orderId,
        status: "pending",
      },
      data: {
        status: "cancelled",
        stripeSessionId: session.id,
      },
    });
  });
}

export async function POST(req: Request) {

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook Stripe non configure" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature Stripe manquante" },
      { status: 400 },
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature error:", error);

    return NextResponse.json(
      { error: "Signature Stripe invalide" },
      { status: 400 },
    );
  }

  // Finalise uniquement les paiements confirmes.
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
          await finalizePaidOrder(session);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await finalizePaidOrder(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await cancelExpiredOrder(session);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return NextResponse.json(
      { error: "Erreur traitement webhook Stripe" },
      { status: 500 },
    );
  }
}
