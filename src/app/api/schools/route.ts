import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createLog } from "../../../lib/logger";
import { sendToQueue } from "../../../lib/rabbitmq";

export async function GET() {
  const schools = await prisma.school.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(schools);
}

export async function POST(request: Request) {
  const body = await request.json();

  const school = await prisma.school.create({
    data: {
      value: {
        name: body.name,
        city: body.city,
        type: body.type,
      },
    },
  });

  await createLog({
    action: "CREATE",
    entity: "School",
    status: "success",
    message: "Okul oluşturuldu",
    detail: school,
  });

  await sendToQueue({
    action: "CREATE",
    entity: "School",
    message: "Okul oluşturuldu",
    data: school,
  });

  return NextResponse.json(school);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const school = await prisma.school.update({
    where: { id: body.id },
    data: {
      value: {
        name: body.name,
        city: body.city,
        type: body.type,
      },
    },
  });

  await createLog({
    action: "UPDATE",
    entity: "School",
    status: "success",
    message: "Okul güncellendi",
    detail: school,
  });

  await sendToQueue({
    action: "UPDATE",
    entity: "School",
    message: "Okul güncellendi",
    data: school,
  });

  return NextResponse.json(school);
}

export async function DELETE(request: Request) {
  const body = await request.json();

  await prisma.school.delete({
    where: { id: body.id },
  });

  await createLog({
    action: "DELETE",
    entity: "School",
    status: "success",
    message: "Okul silindi",
    detail: body,
  });

  await sendToQueue({
    action: "DELETE",
    entity: "School",
    message: "Okul silindi",
    data: body,
  });

  return NextResponse.json({ message: "Okul silindi" });
}