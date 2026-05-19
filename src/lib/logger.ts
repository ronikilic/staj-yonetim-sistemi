import { prisma } from "./prisma";

type LogData = {
  action: string;
  entity: string;
  status: "success" | "error";
  message: string;
  detail?: unknown;
};

export async function createLog(data: LogData) {
  await prisma.log.create({
    data: {
      value: {
        action: data.action,
        entity: data.entity,
        status: data.status,
        message: data.message,
        detail: data.detail || null,
      },
    },
  });
}