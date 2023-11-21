import crypto from "crypto";

export default class Ride {

	constructor (readonly rideId: string, readonly passengerId: string, private driverId: string, private status: string, readonly date: Date, readonly fromLat: number, readonly fromLong: number, readonly toLat: number, readonly toLong: number) {
	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const driverId = "";
		const status = "requested";
		const date = new Date();
		return new Ride(rideId, passengerId, driverId, status, date, fromLat, fromLong, toLat, toLong);
	}

	accept (driverId: string) {
		this.driverId = driverId;
		this.status = "accepted";
	}

	start () {
		this.status = "in_progress";
	}

	getStatus () {
		return this.status;
	}

	getDriverId () {
		return this.driverId;
	}
}