/*
  Warnings:

  - The values [inactive] on the enum `AdminStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `phoneNumber` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - A unique constraint covering the columns `[username,email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super', 'normal');

-- AlterEnum
BEGIN;
CREATE TYPE "AdminStatus_new" AS ENUM ('active', 'deactivated');
ALTER TABLE "Admin" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Admin" ALTER COLUMN "status" TYPE "AdminStatus_new" USING ("status"::text::"AdminStatus_new");
ALTER TYPE "AdminStatus" RENAME TO "AdminStatus_old";
ALTER TYPE "AdminStatus_new" RENAME TO "AdminStatus";
DROP TYPE "AdminStatus_old";
ALTER TABLE "Admin" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- DropIndex
DROP INDEX "Admin_email_key";

-- DropIndex
DROP INDEX "Admin_username_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'normal',
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(15);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_email_key" ON "Admin"("username", "email");
