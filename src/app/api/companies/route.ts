import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createLog } from "../../../lib/logger";
import { sendToQueue } from "../../../lib/rabbitmq";

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(companies);
}

export async function POST(request: Request) {
  const body = await request.json();

  const company = await prisma.company.create({
    data: {
      value: {
        name: body.name,
        sector: body.sector,
        city: body.city,
      },
    },
  });

  await createLog({
    action: "CREATE",
    entity: "Company",
    status: "success",
    message: "İşletme oluşturuldu",
    detail: company,
  });

  await sendToQueue({
    action: "CREATE",
    entity: "Company",
    message: "İşletme oluşturuldu",
    data: company,
  });

  return NextResponse.json(company);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const company = await prisma.company.update({
    where: { id: body.id },
    data: {
      value: {
        name: body.name,
        sector: body.sector,
        city: body.city,
      },
    },
  });

  await createLog({
    action: "UPDATE",
    entity: "Company",
    status: "success",
    message: "İşletme güncellendi",
    detail: company,
  });

  await sendToQueue({
    action: "UPDATE",
    entity: "Company",
    message: "İşletme güncellendi",
    data: company,
  });

  return NextResponse.json(company);
}

export async function DELETE(request: Request) {
  const body = await request.json();

  await prisma.company.delete({
    where: { id: body.id },
  });

  await createLog({
    action: "DELETE",
    entity: "Company",
    status: "success",
    message: "İşletme silindi",
    detail: body,
  });

  await sendToQueue({
    action: "DELETE",
    entity: "Company",
    message: "İşletme silindi",
    data: body,
  });

  return NextResponse.json({ message: "İşletme silindi" });
}