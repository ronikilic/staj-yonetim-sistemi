import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createLog } from "../../../lib/logger";
import { sendToQueue } from "../../../lib/rabbitmq";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("STUDENT GET ERROR:", error);

    return NextResponse.json(
      { message: "Öğrenciler listelenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const student = await prisma.student.create({
      data: {
        value: {
          name: body.name,
          email: body.email,
          department: body.department,
        },
      },
    });

    await createLog({
      action: "CREATE",
      entity: "Student",
      status: "success",
      message: "Öğrenci oluşturuldu",
      detail: student,
    });

    await sendToQueue({
      action: "CREATE",
      entity: "Student",
      message: "Öğrenci oluşturuldu",
      data: student,
    });

    console.log("STUDENT CREATE EVENT SENT:", student.id);

    return NextResponse.json(student);
  } catch (error) {
    console.error("STUDENT CREATE ERROR:", error);

    await createLog({
      action: "CREATE",
      entity: "Student",
      status: "error",
      message: "Öğrenci oluşturulurken hata oluştu",
      detail: String(error),
    });

    await sendToQueue({
      action: "CREATE_ERROR",
      entity: "Student",
      message: "Öğrenci oluşturulurken hata oluştu",
      data: String(error),
    });

    return NextResponse.json(
      { message: "Öğrenci oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const student = await prisma.student.update({
      where: { id: Number(body.id) },
      data: {
        value: {
          name: body.name,
          email: body.email,
          department: body.department,
        },
      },
    });

    await createLog({
      action: "UPDATE",
      entity: "Student",
      status: "success",
      message: "Öğrenci güncellendi",
      detail: student,
    });

    await sendToQueue({
      action: "UPDATE",
      entity: "Student",
      message: "Öğrenci güncellendi",
      data: student,
    });

    console.log("STUDENT UPDATE EVENT SENT:", student.id);

    return NextResponse.json(student);
  } catch (error) {
    console.error("STUDENT UPDATE ERROR:", error);

    await createLog({
      action: "UPDATE",
      entity: "Student",
      status: "error",
      message: "Öğrenci güncellenirken hata oluştu",
      detail: String(error),
    });

    await sendToQueue({
      action: "UPDATE_ERROR",
      entity: "Student",
      message: "Öğrenci güncellenirken hata oluştu",
      data: String(error),
    });

    return NextResponse.json(
      { message: "Öğrenci güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    await prisma.student.delete({
      where: { id: Number(body.id) },
    });

    await createLog({
      action: "DELETE",
      entity: "Student",
      status: "success",
      message: "Öğrenci silindi",
      detail: body,
    });

    await sendToQueue({
      action: "DELETE",
      entity: "Student",
      message: "Öğrenci silindi",
      data: body,
    });

    console.log("STUDENT DELETE EVENT SENT:", body.id);

    return NextResponse.json({
      message: "Öğrenci silindi",
    });
  } catch (error) {
    console.error("STUDENT DELETE ERROR:", error);

    await createLog({
      action: "DELETE",
      entity: "Student",
      status: "error",
      message: "Öğrenci silinirken hata oluştu",
      detail: String(error),
    });

    await sendToQueue({
      action: "DELETE_ERROR",
      entity: "Student",
      message: "Öğrenci silinirken hata oluştu",
      data: String(error),
    });

    return NextResponse.json(
      { message: "Öğrenci silinirken hata oluştu" },
      { status: 500 }
    );
  }
}