import RequestRide from "../../application/usecase/RequestRide";
import SendReceipt from "../../application/usecase/SendReceipt";
import { inject } from "../di/Registry";
import Queue from "./Queue";

export default class QueueController {
	@inject("queue")
	queue?: Queue;
	@inject("sendReceipt")
	sendReceipt?: SendReceipt;
	@inject("requestRide")
	requestRide?: RequestRide;

	constructor () {
		this.queue?.consume("paymentApproved", async (input: any) => {
			await this.sendReceipt?.execute(input);
		});

		this.queue?.consume("requestRide", async (input: any) => {
			await this.requestRide?.execute(input);
		});
	}
	
}
