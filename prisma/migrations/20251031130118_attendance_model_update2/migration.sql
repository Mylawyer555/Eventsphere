/*
  Warnings:

  - You are about to drop the column `attendance_method` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Attendance" DROP COLUMN "attendance_method";

-- DropEnum
DROP TYPE "public"."AttendanceMethod";
