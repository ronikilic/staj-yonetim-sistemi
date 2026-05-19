export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "../../../lib/prisma";
import { createLog } from "../../../lib/logger";
import { sendToQueue } from "../../../lib/rabbitmq";

const allowedTypes = [
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { message: "Dosya bulunamadı" },
      { status: 400 }
    );
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { message: "Bu dosya türüne izin verilmiyor" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "uploads");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(uploadDir, fileName);

  await writeFile(uploadPath, buffer);

  const uploadedFile = await prisma.uploadedFile.create({
    data: {
      value: {
        originalName: file.name,
        savedName: fileName,
        type: file.type,
        size: file.size,
      },
    },
  });

  await createLog({
    action: "UPLOAD",
    entity: "File",
    status: "success",
    message: "Dosya yüklendi",
    detail: uploadedFile,
  });

  await sendToQueue({
    action: "UPLOAD",
    entity: "File",
    message: "Dosya yüklendi",
    data: uploadedFile,
  });

  return NextResponse.json({
    message: "Dosya başarıyla yüklendi",
    file: uploadedFile,
  });
}

export async function GET() {
  const files = await prisma.uploadedFile.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(files);
}