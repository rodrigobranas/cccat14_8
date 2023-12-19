import DomainEvent from "./DomainEvent";

export default class RideCompletedEvent implements DomainEvent {
	name = "rideCompleted";

	constructor (readonly rideId: string, readonly fare: number) {
	}

}
