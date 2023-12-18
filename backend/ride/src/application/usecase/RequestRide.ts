import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";
import Ride from "../../domain/Ride";
import AccountGateway from "../gateway/AccountGateway";

export default class RequestRide {

	constructor (private rideRepository: RideRepository, readonly accountGateway: AccountGateway, private logger: Logger) {
	}

	async execute (input: Input): Promise<Output> {
		this.logger.log(`requestRide`);
		const account = await this.accountGateway.getById(input.passengerId);
		if (!account) throw new Error("Account not found");
		if (!account.isPassenger) throw new Error("Only passengers can request a ride");
		const activeRide = await this.rideRepository.getActiveRideByPassengerId(input.passengerId);
		if (activeRide) throw new Error("Passenger has an active ride");
		const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
		await this.rideRepository.save(ride);
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
