-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "phoneNumber" DROP NOT NULL;
