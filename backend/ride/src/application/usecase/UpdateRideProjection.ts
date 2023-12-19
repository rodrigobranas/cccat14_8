import RideCompletedEvent from "../../domain/event/RideCompletedEvent";
import DatabaseConnection from "../../infra/database/DatabaseConnection";

export default class UpdateRideProjection {

	constructor (readonly connection: DatabaseConnection) {
	}

	async execute (input: RideCompletedEvent): Promise<void> {
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
				ad.name as driver_name,
				ad.cpf as driver_cpf,
				ad.car_plate as driver_car_plate
			from
				cccat14.ride r
				join cccat14.account ap on (ap.account_id = r.passenger_id)
				left join cccat14.account ad on (ad.account_id = r.driver_id)
			where
				r.ride_id = $1
		`,[
			input.rideId
		]);
		await this.connection.query("insert into cccat14.ride_projection (ride_id, passenger_id, driver_id, fare, distance, status, passenger_name, passenger_cpf, driver_name, driver_cpf, driver_car_plate) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [rideData.ride_id, rideData.passenger_id, rideData.driver_id, parseFloat(rideData.fare), parseFloat(rideData.distance), rideData.status, rideData.passenger_name, rideData.passenger_cpf, rideData.driver_name, rideData.driver_cpf, rideData.driver_car_plate]);
	}
}

