/*
  Warnings:

  - You are about to drop the column `familyId` on the `Member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_familyId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "familyId",
ADD COLUMN     "profileImageUrl" TEXT,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "anniversary" DROP NOT NULL;
