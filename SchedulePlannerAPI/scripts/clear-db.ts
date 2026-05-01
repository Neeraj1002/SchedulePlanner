import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cleanupTasks: Array<{
    label: string;
    run: () => Promise<unknown>;
  }> = [
    // { label: 'Attendance', run: () => prisma.attendance.deleteMany() },
    // { label: 'ClassOccurrence', run: () => prisma.classOccurrence.deleteMany() },
    {
      label: "ClassSessionBatch",
      run: () => prisma.classSessionBatch.deleteMany(),
    },
    { label: "ClassSession", run: () => prisma.classSession.deleteMany() },
    {
      label: "TimetableImport",
      run: () => prisma.timetableImport.deleteMany(),
    },
    { label: "User", run: () => prisma.user.deleteMany() },
    { label: "Batch", run: () => prisma.batch.deleteMany() },
    // { label: 'CourseOffering', run: () => prisma.courseOffering.deleteMany() },
    { label: "Course", run: () => prisma.course.deleteMany() },
    { label: "Semester", run: () => prisma.semester.deleteMany() },
    { label: "Department", run: () => prisma.department.deleteMany() },
    { label: "University", run: () => prisma.university.deleteMany() },
  ];

  for (const task of cleanupTasks) {
    try {
      await task.run();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2021"
      ) {
        console.warn(`Skipping ${task.label}: table does not exist yet.`);
        continue;
      }

      throw error;
    }
  }

  console.log("All existing database records have been deleted.");
}

main()
  .catch((error) => {
    console.error("Failed to clear database records.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
