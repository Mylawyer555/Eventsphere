-- CreateEnum
CREATE TYPE "public"."TwoFactorMethod" AS ENUM ('EMAIL', 'SMS', 'AUTH_APP');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "twoFactorType" "public"."TwoFactorMethod";
