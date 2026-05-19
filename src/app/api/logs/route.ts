import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const logs = await prisma.log.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(logs);
}