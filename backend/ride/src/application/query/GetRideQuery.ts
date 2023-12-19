import DatabaseConnection from "../../infra/database/DatabaseConnection";

export default class GetRideQuery {

	constructor (readonly connection: DatabaseConnection) {
	}

	async execute (rideId: string): Promise<Output> {
		const [rideData] = await this.connection.query(`
			select
				r.ride_id,
				r.fare,
				r.distance,
				r.status,
				r.passenger_id,
				r.driver_id,
				ap.name as passenger_name,
				ap.cpf as passenger_cpf,
				ad.car_plate as driver_car_plate
			from
				cccat14.ride r
				join cccat14.account ap on (ap.account_id = r.passenger_id)
				left join cccat14.account ad on (ad.account_id = r.driver_id)
			where
				r.ride_id = $1
		`,[
			rideId
		]);
		return {
			rideId: rideData.ride_id,
			status: rideData.status,
			driverId: rideData.driver_id,
			passengerId: rideData.passenger_id,
			distance: parseFloat(rideData.distance),
			fare: parseFloat(rideData.fare),
			passengerName: rideData.passenger_name,
			passengerCpf: rideData.passenger_cpf,
			driverCarPlate: rideData.driver_car_plate
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
