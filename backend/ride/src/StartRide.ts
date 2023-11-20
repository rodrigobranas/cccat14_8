import crypto from "crypto";
import Logger from "./Logger";
import RideDAO from "./RideDAO";
import AccountDAO from "./AccountRepository";

export default class StartRide {

	constructor (private rideDAO: RideDAO) {
	}

	async execute (input: any) {
		const ride = await this.rideDAO.getById(input.rideId);
		ride.status = "in_progress";
		await this.rideDAO.update(ride);
	}

}
