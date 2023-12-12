import ProcessPayment from "../../application/usecase/ProcessPayment";
import { inject } from "../di/Registry";
import Queue from "./Queue";

export default class QueueController {
	@inject("queue")
	queue?: Queue;
	@inject("processPayment")
	processPayment?: ProcessPayment;

	constructor () {
		this.queue?.consume("rideCompleted", async (input: any) => {
			await this.processPayment?.execute(input);
		});
	}
	
}
