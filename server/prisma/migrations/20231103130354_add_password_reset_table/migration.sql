-- CreateEnum
CREATE TYPE "resetScope" AS ENUM ('Admin', 'Member');

-- CreateTable
CREATE TABLE "ResetPassword" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "scope" "resetScope" NOT NULL DEFAULT 'Member',
    "expiry" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResetPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_token_key" ON "ResetPassword"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_email_key" ON "ResetPassword"("email");
