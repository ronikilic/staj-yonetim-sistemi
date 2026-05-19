-- CreateTable
CREATE TABLE "converted_html" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" JSONB NOT NULL,

    CONSTRAINT "converted_html_pkey" PRIMARY KEY ("id")
);
