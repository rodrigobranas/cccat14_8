import RideRepository from "../repository/RideRepository";

export default class StartRide {

	constructor (private rideRepository: RideRepository) {
	}

	async execute (input: any) {
		const ride = await this.rideRepository.getById(input.rideId);
		if (!ride) throw new Error("Ride not found");
		ride.start();
		await this.rideRepository.update(ride);
	}

}
