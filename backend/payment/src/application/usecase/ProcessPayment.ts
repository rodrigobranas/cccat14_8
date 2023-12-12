import Transaction from "../../domain/Transaction";
import Queue from "../../infra/queue/Queue";
import TransactionRepository from "../repository/TransactionRepository";

export default class ProcessPayment {

	constructor (readonly transactionRepository: TransactionRepository, readonly queue: Queue) {
	}

	async execute (input: Input): Promise<void> {
		console.log(input);
		const transaction = Transaction.create(input.rideId, input.amount);
		transaction.pay();
		await this.transactionRepository.save(transaction);
		await this.queue.publish("paymentApproved", { transactionId: transaction.transactionId, rideId: input.rideId });
	}
}

type Input = {
	rideId: string,
	creditCardToken: string,
	amount: number
}
