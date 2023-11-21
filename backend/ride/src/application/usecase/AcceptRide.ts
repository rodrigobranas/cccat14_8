import crypto from "crypto";
import Logger from "../logger/Logger";
import RideDAO from "../repository/RideRepository";
import AccountDAO from "../repository/AccountRepository";

export default class AcceptRide {

	constructor (private rideDAO: RideDAO, private accountDAO: AccountDAO) {
	}

	async execute (input: any) {
		const account = await this.accountDAO.getById(input.driverId);
		if (account && !account.isDriver) throw new Error("Only drivers can accept a ride");
		const ride = await this.rideDAO.getById(input.rideId);
		if (!ride) throw new Error("Ride not found");
		ride.accept(input.driverId);
		await this.rideDAO.update(ride);
	}

}
