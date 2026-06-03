-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'succeeded', 'failed', 'cancelled');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stripeSessionId_key" ON "Transaction"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stripePaymentIntentId_key" ON "Transaction"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stripeEventId_key" ON "Transaction"("stripeEventId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_orderId_idx" ON "Transaction"("orderId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
