import amqp from "amqplib";

const QUEUE_NAME = "system_logs";

export async function sendToQueue(message: unknown) {
  try {
    const connection = await amqp.connect(
      "amqp://admin:1234@localhost:5672"
    );

    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME);

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message))
    );

    console.log("RabbitMQ mesaj gönderildi");

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.log("RabbitMQ Hatası:", error);
  }
}