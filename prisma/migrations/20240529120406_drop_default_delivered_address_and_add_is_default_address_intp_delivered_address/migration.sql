/*
  Warnings:

  - You are about to drop the `default_customers_delivered_addresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "default_customers_delivered_addresses" DROP CONSTRAINT "default_customers_delivered_addresses_customerId_fkey";

-- DropForeignKey
ALTER TABLE "default_customers_delivered_addresses" DROP CONSTRAINT "default_customers_delivered_addresses_deliveredAddressId_fkey";

-- AlterTable
ALTER TABLE "delivered_addresses" ADD COLUMN     "isDefaultAddress" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "default_customers_delivered_addresses";
