import crypto from "crypto";
import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";
import PositionRepository from "../repository/PositionRepository";
import DistanceCalculator from "../../domain/DistanceCalculator";

export default class GetRideByPassengerId {

	constructor (private rideRepository: RideRepository, private positionRepository: PositionRepository, private logger: Logger) {
	}

	async execute (passengerId: string): Promise<Output> {
		const ride = await this.rideRepository.getActiveRideByPassengerId(passengerId);
		if (!ride) throw new Error("Ride not found");
		return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId,
			distance: ride.getDistance(),
			fare: ride.getFare()
		};
	}

}

type Output = {
	rideId: string,
	status: string,
	driverId: string,
	passengerId: string,
	distance?: number,
	fare?: number
}