-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('PARTICIPANT', 'ORGANIZER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Events_Category" AS ENUM ('ACADEMIC_AND_PROFESSIONAL', 'ARTS_AND_CULTURE', 'SOCIAL_AND_RECREATIONAL', 'EDUCATIONAL_AND_DEVELOPMENT', 'COMPETITIONS');

-- CreateEnum
CREATE TYPE "public"."Department" AS ENUM ('FACULTY_OF_MEDICINE', 'FACULTY_OF_DENTISTRY', 'FACULTY_OF_NURSING', 'FACULTY_OF_ENGINEERING', 'FACULTY_OF_LAW');

-- CreateEnum
CREATE TYPE "public"."Reg_Status" AS ENUM ('PENDING', 'SUCCESSFUL');

-- CreateEnum
CREATE TYPE "public"."Waitlist_Status" AS ENUM ('WAITING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('VIDEO', 'IMAGES', 'SLIDES');

-- CreateEnum
CREATE TYPE "public"."Approval" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('EVENT_REGISTRATION', 'EVENT_REMINDER', 'EVENT_UPDATE', 'EVENT_CANCELLATION', 'CERTIFICATE_AVAILABLE');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('UNREAD', 'READ', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'PARTICIPANT',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "profile_Id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "enrollment_number" TEXT NOT NULL,
    "profile_picture" TEXT,
    "bio" TEXT,
    "mobile_no" INTEGER NOT NULL,
    "department" "public"."Department" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profile_Id")
);

-- CreateTable
CREATE TABLE "public"."Events" (
    "Event_id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT,
    "Category" "public"."Events_Category" NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Time" TIMESTAMP(3) NOT NULL,
    "Approval_State" "public"."Approval" NOT NULL DEFAULT 'PENDING',
    "Approval_message" TEXT,
    "Created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("Event_id")
);

-- CreateTable
CREATE TABLE "public"."Events_Venue" (
    "Venue_id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "Address" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "Online_url" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "Changed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Events_Venue_pkey" PRIMARY KEY ("Venue_id")
);

-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Student_id" INTEGER,
    "Created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event_Seating" (
    "id" SERIAL NOT NULL,
    "Venue_id" INTEGER NOT NULL,
    "total_Seats" INTEGER NOT NULL,
    "Seats_Booked" INTEGER NOT NULL,
    "Seats_Available" INTEGER NOT NULL,
    "isWaitlist_Enabled" BOOLEAN NOT NULL,
    "Created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_Seating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Certificate" (
    "id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Student_id" INTEGER NOT NULL,
    "Certificate_Url" TEXT NOT NULL,
    "Issued_on" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaGallery" (
    "id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "File_type" "public"."MediaType" NOT NULL,
    "caption" TEXT NOT NULL,
    "Uploaded_on" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feedback" (
    "id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Student_id" INTEGER NOT NULL,
    "Ratings" INTEGER NOT NULL,
    "Comments" TEXT NOT NULL,
    "Created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "Attendance_id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Student_id" INTEGER NOT NULL,
    "isAttended" BOOLEAN NOT NULL,
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("Attendance_id")
);

-- CreateTable
CREATE TABLE "public"."Event_Sharelog" (
    "Share_id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Message" TEXT,
    "Created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_Sharelog_pkey" PRIMARY KEY ("Share_id")
);

-- CreateTable
CREATE TABLE "public"."Event_Waitlist" (
    "Waitlist_id" SERIAL NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "Waitlist_Time" TIMESTAMP(3) NOT NULL,
    "Status" "public"."Waitlist_Status" NOT NULL,

    CONSTRAINT "Event_Waitlist_pkey" PRIMARY KEY ("Waitlist_id")
);

-- CreateTable
CREATE TABLE "public"."CalenderSync" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Calender_type" TEXT NOT NULL,
    "Sync_Timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Calender_url" TEXT NOT NULL,

    CONSTRAINT "CalenderSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event_Bookmark" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "Notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Type" "public"."NotificationType" NOT NULL,
    "Message" TEXT NOT NULL,
    "Status" "public"."NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "Created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("Notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "public"."Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_enrollment_number_key" ON "public"."Profile"("enrollment_number");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_Event_id_key" ON "public"."Certificate"("Event_id");

-- CreateIndex
CREATE UNIQUE INDEX "CalenderSync_Event_id_key" ON "public"."CalenderSync"("Event_id");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Events_Venue" ADD CONSTRAINT "Events_Venue_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_Student_id_fkey" FOREIGN KEY ("Student_id") REFERENCES "public"."User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Seating" ADD CONSTRAINT "Event_Seating_Venue_id_fkey" FOREIGN KEY ("Venue_id") REFERENCES "public"."Events_Venue"("Venue_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_Student_id_fkey" FOREIGN KEY ("Student_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaGallery" ADD CONSTRAINT "MediaGallery_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_Student_id_fkey" FOREIGN KEY ("Student_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Sharelog" ADD CONSTRAINT "Event_Sharelog_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Sharelog" ADD CONSTRAINT "Event_Sharelog_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Waitlist" ADD CONSTRAINT "Event_Waitlist_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Waitlist" ADD CONSTRAINT "Event_Waitlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalenderSync" ADD CONSTRAINT "CalenderSync_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."Events"("Event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalenderSync" ADD CONSTRAINT "CalenderSync_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
