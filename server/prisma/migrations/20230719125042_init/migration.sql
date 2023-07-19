-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('active', 'inactive', 'deactivated');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('registered', 'unregistered', 'relocated', 'excommunicated');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('student', 'employed', 'unemployed');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('single', 'married', 'widow');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "password" TEXT NOT NULL,
    "status" "AdminStatus" NOT NULL DEFAULT 'inactive',
    "lastLoggedIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'unregistered',
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'employed',
    "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'single',
    "dateOfBirth" DATE NOT NULL,
    "anniversary" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phoneNumber_key" ON "Member"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
