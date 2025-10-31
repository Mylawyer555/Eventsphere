/*
  Warnings:

  - A unique constraint covering the columns `[Event_id,StudentId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendance_Event_id_StudentId_key" ON "public"."Attendance"("Event_id", "StudentId");
