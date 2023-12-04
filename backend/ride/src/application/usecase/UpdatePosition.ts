import RideRepository from "../repository/RideRepository";
import Position from "../../domain/Position";
import PositionRepository from "../repository/PositionRepository";

export default class UpdatePosition {

	constructor (private rideRepository: RideRepository, private positionRepository: PositionRepository) {
	}

	async execute (input: Input) {
		const ride = await this.rideRepository.getById(input.rideId);
		if (!ride) throw new Error("Ride not found");
		if (ride.getStatus() !== "in_progress") throw new Error("To update position ride must be in progress");
		const position = Position.create(input.rideId, input.lat, input.long);
		await this.positionRepository.save(position);
		ride.updatePosition(position);
		await this.rideRepository.update(ride);
	}

}

type Input = {
	rideId: string,
	lat: number,
	long: number
}
