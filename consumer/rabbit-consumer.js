const amqp = require("amqplib");

const QUEUE_NAME = "system_logs";

async function startConsumer() {
  try {
    const connection = await amqp.connect("amqp://admin:1234@localhost:5672");
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME);

    console.log("RabbitMQ Consumer çalışıyor...");
    console.log("Mesaj bekleniyor...");

    channel.consume(QUEUE_NAME, (message) => {
      if (message !== null) {
        const data = JSON.parse(message.content.toString());

        console.log("Yeni mesaj alındı:");
        console.log(data);

        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Consumer hatası:", error);
  }
}

startConsumer();