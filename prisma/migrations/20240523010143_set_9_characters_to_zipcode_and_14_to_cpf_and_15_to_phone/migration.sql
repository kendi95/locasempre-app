-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "zipcode" SET DATA TYPE VARCHAR(9);

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(14),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "delivered_addresses" ALTER COLUMN "zipcode" SET DATA TYPE VARCHAR(9);
