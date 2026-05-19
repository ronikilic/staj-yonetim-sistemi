export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import * as mammoth from "mammoth";

import { prisma } from "../../../lib/prisma";
import { createLog } from "../../../lib/logger";
import { sendToQueue } from "../../../lib/rabbitmq";

type FileValue = {
  originalName: string;
  savedName: string;
  type: string;
  size: number;
};

export async function GET() {
  try {
    const files = await prisma.uploadedFile.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const wordFiles = files.filter((file) => {
      const value = file.value as FileValue;

      return (
        value.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    });

    return NextResponse.json(wordFiles);
  } catch (error) {
    console.error("WORD GET ERROR:", error);

    return NextResponse.json(
      { message: "Word dosyaları listelenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileId = Number(body.fileId);

    if (!fileId) {
      return NextResponse.json(
        { message: "Word dosyası ID gerekli" },
        { status: 400 }
      );
    }

    const uploadedFile = await prisma.uploadedFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!uploadedFile) {
      return NextResponse.json(
        { message: "Dosya bulunamadı" },
        { status: 404 }
      );
    }

    const value = uploadedFile.value as FileValue;

    if (
      value.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return NextResponse.json(
        { message: "Sadece Word .docx dosyaları dönüştürülebilir" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "uploads", value.savedName);
    const buffer = await readFile(filePath);

    const converted = await mammoth.convertToHtml({ buffer });

    const htmlRecord = await prisma.convertedHtml.create({
      data: {
        value: {
          originalFileName: value.originalName,
          fileId,
          html: converted.value,
          messages: converted.messages,
        },
      },
    });

    await createLog({
      action: "WORD_TO_HTML",
      entity: "File",
      status: "success",
      message: "Word dosyası HTML formatına dönüştürüldü",
      detail: htmlRecord,
    });

    await sendToQueue({
      action: "WORD_TO_HTML",
      entity: "File",
      message: "Word dosyası HTML formatına dönüştürüldü",
      data: htmlRecord,
    });

    return NextResponse.json({
      message: "Word dosyası HTML'e dönüştürüldü",
      result: htmlRecord,
    });
  } catch (error) {
    console.error("WORD CONVERT ERROR:", error);

    return NextResponse.json(
      { message: "Word dönüştürme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}