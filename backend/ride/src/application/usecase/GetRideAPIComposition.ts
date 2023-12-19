import crypto from "crypto";
import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";
import PositionRepository from "../repository/PositionRepository";
import DistanceCalculator from "../../domain/DistanceCalculator";
import AccountGateway from "../gateway/AccountGateway";

export default class GetRideAPIComposition {

	constructor (private rideRepository: RideRepository, private accountGateway: AccountGateway) {
	}

	async execute (rideId: string): Promise<Output> {
		const ride = await this.rideRepository.getById(rideId);
		if (!ride) throw new Error("Ride not found");
		const passenger = await this.accountGateway.getById(ride.passengerId);
		let driver;
		if (ride.getDriverId()) {
			driver = await this.accountGateway.getById(ride.getDriverId());
		}
		return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId,
			distance: ride.getDistance(),
			fare: ride.getFare(),
			passengerName: passenger.name,
			passengerCpf: passenger.cpf,
			driverCarPlate: driver?.carPlate
		};
	}

}

type Output = {
	rideId: string,
	status: string,
	driverId: string,
	passengerId: string,
	distance?: number,
	fare?: number,
	passengerName: string,
	passengerCpf: string,
	driverCarPlate?: string
}
