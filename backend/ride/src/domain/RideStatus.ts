import Ride from "./Ride";

export default abstract class RideStatus {
	abstract value: string;

	constructor (readonly ride: Ride) {
	}

	abstract request (): void;
	abstract accept (): void;
	abstract start (): void;
	abstract finish (): void;
}

export class RequestedStatus extends RideStatus {
	
	value: string;

	constructor (ride: Ride) {
		super(ride);
		this.value = "requested";
	}

	request(): void {
		throw new Error("Invalid status");
	}
	
	accept(): void {
		this.ride.status = new AcceptedStatus(this.ride);
	}

	start(): void {
		throw new Error("Invalid status");
	}

	finish(): void {
		throw new Error("Invalid status");
	}

}

export class AcceptedStatus extends RideStatus {
	value: string;

	constructor (ride: Ride) {
		super(ride);
		this.value = "accepted";
	}

	request(): void {
		throw new Error("Invalid status");
	}
	
	accept(): void {
		throw new Error("Invalid status");
	}

	start(): void {
		this.ride.status = new InProgressStatus(this.ride);
	}

	finish(): void {
		throw new Error("Invalid status");
	}

}

export class InProgressStatus extends RideStatus {
	value: string;

	constructor (ride: Ride) {
		super(ride);
		this.value = "in_progress";
	}

	request(): void {
		throw new Error("Invalid status");
	}
	
	accept(): void {
		throw new Error("Invalid status");
	}

	start(): void {
		throw new Error("Invalid status");
	}

	finish(): void {
		this.ride.status = new CompletedStatus(this.ride);
	}

}

export class CompletedStatus extends RideStatus {
	value: string;

	constructor (ride: Ride) {
		super(ride);
		this.value = "completed";
	}

	request(): void {
		throw new Error("Invalid status");
	}
	
	accept(): void {
		throw new Error("Invalid status");
	}

	start(): void {
		throw new Error("Invalid status");
	}

	finish(): void {
		throw new Error("Invalid status");
	}

}

export class RideStatusFactory {
	static create (type: string, ride: Ride) {
		if (type === "requested") return new RequestedStatus(ride);
		if (type === "accepted") return new AcceptedStatus(ride);
		if (type === "in_progress") return new InProgressStatus(ride);
		if (type === "completed") return new CompletedStatus(ride);
		throw new Error();
	}
}