-- CreateTable
CREATE TABLE "reset_user_account" (
    "id" UUID NOT NULL,
    "isReseted" BOOLEAN NOT NULL DEFAULT false,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reset_user_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_user_account_userId_key" ON "reset_user_account"("userId");

-- AddForeignKey
ALTER TABLE "reset_user_account" ADD CONSTRAINT "reset_user_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
