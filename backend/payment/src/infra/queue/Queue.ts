import amqp from "amqplib";

export default class Queue {


	async publish (queue: string, data: any) {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();
		channel.assertQueue(queue, { durable: true });
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
	}

	async consume (queue: string, callback: Function) {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();
		channel.assertQueue(queue, { durable: true });
		channel.consume(queue, async (msg: any) => {
			const input = JSON.parse(msg.content.toString());
			await callback(input);
			channel.ack(msg);
		});
	}
}
