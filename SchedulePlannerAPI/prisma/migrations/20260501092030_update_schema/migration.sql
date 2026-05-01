-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('LECTURE', 'TUTORIAL', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "SemesterType" AS ENUM ('AUTUMN', 'SPRING');

-- CreateEnum
CREATE TYPE "OccurrenceStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'EXTRA');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'BUNKED');

-- CreateTable
CREATE TABLE "University" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "semesterNumber" INTEGER NOT NULL,
    "semesterType" "SemesterType" NOT NULL,
    "academicYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "courseCode" TEXT NOT NULL,
    "courseName" TEXT,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseOffering" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "semesterType" "SemesterType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "batchCode" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "batchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSession" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "importId" INTEGER,
    "classType" "ClassType" NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT,
    "faculty" TEXT,
    "rawText" TEXT,
    "sourcePage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSessionBatch" (
    "id" SERIAL NOT NULL,
    "classSessionId" INTEGER NOT NULL,
    "batchId" INTEGER NOT NULL,

    CONSTRAINT "ClassSessionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassOccurrence" (
    "id" SERIAL NOT NULL,
    "classSessionId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "OccurrenceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "occurrenceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimetableImport" (
    "id" SERIAL NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parserWarnings" JSONB,

    CONSTRAINT "TimetableImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_universityId_name_key" ON "Department"("universityId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_departmentId_semesterNumber_academicYear_key" ON "Semester"("departmentId", "semesterNumber", "academicYear");

-- CreateIndex
CREATE INDEX "Course_departmentId_idx" ON "Course"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseCode_departmentId_key" ON "Course"("courseCode", "departmentId");

-- CreateIndex
CREATE INDEX "CourseOffering_departmentId_year_semesterType_idx" ON "CourseOffering"("departmentId", "year", "semesterType");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOffering_courseId_departmentId_year_semesterType_key" ON "CourseOffering"("courseId", "departmentId", "year", "semesterType");

-- CreateIndex
CREATE INDEX "Batch_semesterId_idx" ON "Batch"("semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchCode_semesterId_key" ON "Batch"("batchCode", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_batchId_idx" ON "User"("batchId");

-- CreateIndex
CREATE INDEX "ClassSession_semesterId_dayOfWeek_startTime_idx" ON "ClassSession"("semesterId", "dayOfWeek", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSession_courseId_semesterId_dayOfWeek_startTime_classT_key" ON "ClassSession"("courseId", "semesterId", "dayOfWeek", "startTime", "classType");

-- CreateIndex
CREATE INDEX "ClassSessionBatch_batchId_idx" ON "ClassSessionBatch"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSessionBatch_classSessionId_batchId_key" ON "ClassSessionBatch"("classSessionId", "batchId");

-- CreateIndex
CREATE INDEX "ClassOccurrence_date_idx" ON "ClassOccurrence"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ClassOccurrence_classSessionId_date_key" ON "ClassOccurrence"("classSessionId", "date");

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_occurrenceId_userId_key" ON "Attendance"("occurrenceId", "userId");

-- CreateIndex
CREATE INDEX "TimetableImport_semesterId_importedAt_idx" ON "TimetableImport"("semesterId", "importedAt");

-- CreateIndex
CREATE INDEX "TimetableImport_checksum_idx" ON "TimetableImport"("checksum");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOffering" ADD CONSTRAINT "CourseOffering_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOffering" ADD CONSTRAINT "CourseOffering_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_importId_fkey" FOREIGN KEY ("importId") REFERENCES "TimetableImport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSessionBatch" ADD CONSTRAINT "ClassSessionBatch_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSessionBatch" ADD CONSTRAINT "ClassSessionBatch_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOccurrence" ADD CONSTRAINT "ClassOccurrence_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES "ClassOccurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableImport" ADD CONSTRAINT "TimetableImport_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
