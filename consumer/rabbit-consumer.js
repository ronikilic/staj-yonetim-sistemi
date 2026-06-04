const amqp = require("amqplib");

const QUEUE_NAME = "system_logs";

async function startConsumer() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://admin:1234@localhost:5672"
    );

    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME);

    console.log("RabbitMQ Consumer çalışıyor...");
    console.log("Mesaj bekleniyor...");

    channel.consume(QUEUE_NAME, (message) => {
      if (message) {
        const data = JSON.parse(message.content.toString());

        console.log("Yeni mesaj alındı:");
        console.log(data);

        channel.ack(message);
      }
    });
  } catch (error) {
    console.log("RabbitMQ hazır değil. 5 saniye sonra tekrar denenecek...");

    setTimeout(() => {
      startConsumer();
    }, 5000);
  }
}

startConsumer();