import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "../../../lib/prisma";
import { createLog } from "../../../lib/logger";
import { sendToQueue } from "../../../lib/rabbitmq";

export async function POST(request: Request) {
  const body = await request.json();

  const prompt = body.prompt;

  if (!prompt) {
    return NextResponse.json(
      { message: "Prompt boş olamaz" },
      { status: 400 }
    );
  }

  const result = `
AI Analiz Sonucu:

Girilen komut:
${prompt}

Demo cevap:
Bu prompt sistem tarafından başarıyla analiz edildi.
Bu bölüm gerçek OpenAI / MCP / RAG servisine bağlanacak şekilde hazırlanmıştır.
`;

  await createLog({
    action: "AI_ANALYZE",
    entity: "AI",
    status: "success",
    message: "Yapay zeka analizi yapıldı",
    detail: { prompt, result },
  });

  await sendToQueue({
    action: "AI_ANALYZE",
    entity: "AI",
    message: "Yapay zeka analizi yapıldı",
    data: { prompt, result },
  });

  return NextResponse.json({ result });
}

export async function GET() {
  const txtFiles = await prisma.uploadedFile.findMany({
    orderBy: { id: "desc" },
  });

  const onlyTxtFiles = txtFiles.filter((file) => {
    const value = file.value as {
      type?: string;
      savedName?: string;
      originalName?: string;
    };

    return value.type === "text/plain";
  });

  return NextResponse.json(onlyTxtFiles);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const fileId = body.fileId;

  if (!fileId) {
    return NextResponse.json(
      { message: "Dosya ID gerekli" },
      { status: 400 }
    );
  }

  const uploadedFile = await prisma.uploadedFile.findUnique({
    where: { id: fileId },
  });

  if (!uploadedFile) {
    return NextResponse.json(
      { message: "Dosya bulunamadı" },
      { status: 404 }
    );
  }

  const value = uploadedFile.value as {
    originalName: string;
    savedName: string;
    type: string;
    size: number;
  };

  if (value.type !== "text/plain") {
    return NextResponse.json(
      { message: "Sadece TXT dosyaları analiz edilebilir" },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), "uploads", value.savedName);
  const fileContent = await readFile(filePath, "utf-8");

  const result = `
TXT Dosyası AI Analiz Sonucu:

Dosya adı:
${value.originalName}

Dosya içeriği:
${fileContent}

Demo cevap:
TXT içindeki prompt komutları sistem tarafından başarıyla okundu ve analiz edildi.
Bu bölüm gerçek OpenAI / MCP / RAG entegrasyonuna hazır yapıdadır.
`;

  await createLog({
    action: "AI_FILE_ANALYZE",
    entity: "AI",
    status: "success",
    message: "TXT dosyası yapay zeka ile analiz edildi",
    detail: {
      file: uploadedFile,
      result,
    },
  });

  await sendToQueue({
    action: "AI_FILE_ANALYZE",
    entity: "AI",
    message: "TXT dosyası yapay zeka ile analiz edildi",
    data: {
      file: uploadedFile,
      result,
    },
  });

  return NextResponse.json({ result });
}