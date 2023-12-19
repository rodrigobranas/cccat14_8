import crypto from "crypto";
import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";
import PositionRepository from "../repository/PositionRepository";
import PaymentGateway from "../gateway/PaymentGateway";
import Queue from "../../infra/queue/Queue";
import RideCompletedEvent from "../../domain/event/RideCompletedEvent";
import DomainEvent from "../../domain/event/DomainEvent";
import EventProxy from "../../infra/queue/EventProxy";

export default class FinishRide {

	constructor (private rideRepository: RideRepository, private paymentGateway: PaymentGateway, private queue: Queue) {
	}

	async execute (input: Input) {
		const ride = await this.rideRepository.getById(input.rideId);
		if (!ride) throw new Error("Ride not found");
		ride.register(async (event: DomainEvent) => {
			await this.queue.publish(event.name, event);
		});
		if (ride.getStatus() !== "in_progress") throw new Error("To update position ride must be in progress");
		ride.finish();
		await this.rideRepository.update(ride);
	}

}

type Input = {
	rideId: string
}
