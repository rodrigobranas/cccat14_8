import Logger from "../logger/Logger";
import RideDAO from "../repository/RideRepository";
import AccountDAO from "../repository/AccountRepository";
import Ride from "../../domain/Ride";

export default class RequestRide {

	constructor (private rideDAO: RideDAO, private accountDAO: AccountDAO, private logger: Logger) {
	}

	async execute (input: Input): Promise<Output> {
		this.logger.log(`requestRide`);
		const account = await this.accountDAO.getById(input.passengerId);
		if (!account) throw new Error("Account does not exist");
		if (!account.isPassenger) throw new Error("Only passengers can request a ride");
		const activeRide = await this.rideDAO.getActiveRideByPassengerId(input.passengerId);
		if (activeRide) throw new Error("Passenger has an active ride");
		const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
		await this.rideDAO.save(ride);
		return {
			rideId: ride.rideId
		};
	}

}

type Input = {
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
}

type Output = {
	rideId: string
}
