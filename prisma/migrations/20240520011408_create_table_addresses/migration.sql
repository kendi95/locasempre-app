-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "address" VARCHAR(64) NOT NULL,
    "numberAddress" INTEGER NOT NULL,
    "zipcode" VARCHAR(8) NOT NULL,
    "neighborhood" VARCHAR(64) NOT NULL,
    "complement" VARCHAR(128) NOT NULL,
    "city" VARCHAR(48) NOT NULL,
    "provincy" VARCHAR(2) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);
