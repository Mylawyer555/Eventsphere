/*
  Warnings:

  - You are about to drop the column `department` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `enrollment_number` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enrollment_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollment_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Profile_enrollment_number_key";

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "department",
DROP COLUMN "enrollment_number",
DROP COLUMN "fullName";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "department" "public"."Department" NOT NULL,
ADD COLUMN     "enrollment_number" TEXT NOT NULL,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_enrollment_number_key" ON "public"."User"("enrollment_number");
