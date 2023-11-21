import crypto from "crypto";
import Logger from "../logger/Logger";
import RideDAO from "../repository/RideRepository";
import AccountDAO from "../repository/AccountRepository";

export default class StartRide {

	constructor (private rideDAO: RideDAO) {
	}

	async execute (input: any) {
		const ride = await this.rideDAO.getById(input.rideId);
		if (!ride) throw new Error("Ride not found");
		ride.start();
		await this.rideDAO.update(ride);
	}

}
