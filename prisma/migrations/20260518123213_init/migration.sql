-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" JSONB NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);
