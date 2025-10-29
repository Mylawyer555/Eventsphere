/*
  Warnings:

  - You are about to drop the column `Student_id` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `StudentId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attendance_method` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AttendanceMethod" AS ENUM ('QR_SCAN', 'MANUAL_CHECKIN', 'AUTO_VERIFIED', 'ABSENT');

-- AlterTable
ALTER TABLE "public"."Attendance" DROP COLUMN "Student_id",
ADD COLUMN     "StudentId" INTEGER NOT NULL,
ADD COLUMN     "attendance_method" "public"."AttendanceMethod" NOT NULL,
ADD COLUMN     "certificateIssued" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Events" ADD COLUMN     "organizerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Outbox" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Events" ADD CONSTRAINT "Events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE RESTRICT ON UPDATE CASCADE;
