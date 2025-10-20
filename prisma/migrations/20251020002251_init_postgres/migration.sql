-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeUntil" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plan" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT;
