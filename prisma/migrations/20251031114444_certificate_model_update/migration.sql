-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE');

-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "status" "public"."AttendanceStatus" NOT NULL DEFAULT 'ABSENT';

-- AlterTable
ALTER TABLE "public"."Certificate" ADD COLUMN     "issued" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pdfUrl" TEXT;
