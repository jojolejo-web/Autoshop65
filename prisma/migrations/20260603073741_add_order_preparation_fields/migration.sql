-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isPrepared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preparationEmailSentAt" TIMESTAMP(3),
ADD COLUMN     "preparedAt" TIMESTAMP(3);
