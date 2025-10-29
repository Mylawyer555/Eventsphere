-- CreateEnum
CREATE TYPE "public"."Event_Status" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Events" ADD COLUMN     "Status" "public"."Event_Status" NOT NULL DEFAULT 'UPCOMING';
