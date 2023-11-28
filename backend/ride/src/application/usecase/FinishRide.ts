import crypto from "crypto";
import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";
import AccountDAO from "../repository/AccountRepository";
import Position from "../../domain/Position";
import PositionRepository from "../repository/PositionRepository";
import DistanceCalculator from "../../domain/DistanceCalculator";

export default class FinishRide {

	constructor (private rideRepository: RideRepository, private positionRepository: PositionRepository) {
	}

	async execute (input: Input) {
		const ride = await this.rideRepository.getById(input.rideId);
		if (!ride) throw new Error("Ride not found");
		if (ride.getStatus() !== "in_progress") throw new Error("To update position ride must be in progress");
		ride.finish();
		await this.rideRepository.update(ride);
	}

}

type Input = {
	rideId: string
}
