-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('active', 'deactivated');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super', 'normal');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('registered', 'unregistered', 'relocated', 'excommunicated');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('student', 'employed', 'unemployed');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('single', 'married', 'widow');

-- CreateEnum
CREATE TYPE "HomeFellowship" AS ENUM ('OKOTA_I', 'OKOTA_II', 'ISOLO_I', 'ISOLO_II', 'ISOLO_III', 'ISOLO_IV', 'MUSHIN', 'AJAO_ESTATE', 'EGBE_I', 'EGBE_II', 'IDIMU', 'OKE_AFA_I', 'OKE_AFA_II', 'OKE_AFA_III', 'OKE_AFA_IV', 'OKE_AFA_V', 'ABULE_IGBIRA', 'JAKANDE_I', 'JAKANDE_II', 'JAKANDE_III', 'JAKANDE_IV', 'BUCKNOR', 'EJIGBO_I', 'EJIGBO_II', 'EJIGBO_III', 'EJIGBO_IV', 'ISHERI_OSUN', 'IJEGUN_I', 'IJEGUN_II', 'ABARANJE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT,
    "email" VARCHAR(320),
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'normal',
    "status" "AdminStatus" NOT NULL DEFAULT 'active',
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
    "profileImageUrl" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "age" INTEGER,
    "email" VARCHAR(320),
    "phoneNumber" VARCHAR(15),
    "address" TEXT,
    "password" TEXT NOT NULL,
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'unregistered',
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'employed',
    "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'single',
    "homeFellowship" "HomeFellowship" DEFAULT 'OKE_AFA_I',
    "dateOfBirth" DATE,
    "anniversary" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phoneNumber_key" ON "Member"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_token_key" ON "Tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_userId_key" ON "Tokens"("userId");
