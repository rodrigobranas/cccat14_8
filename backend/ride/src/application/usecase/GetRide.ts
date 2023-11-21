import crypto from "crypto";
import Logger from "../logger/Logger";
import RideDAO from "../repository/RideRepository";

export default class GetRide {

	constructor (private rideDAO: RideDAO, private logger: Logger) {
	}

	async execute (rideId: string): Promise<Output> {
		this.logger.log(`getRide`);
		const ride = await this.rideDAO.getById(rideId);
		if (!ride) throw new Error("Ride not found");
		return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId
		};
	}

}

type Output = {
	rideId: string,
	status: string,
	driverId: string,
	passengerId: string
}