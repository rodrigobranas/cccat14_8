import RideCompletedEvent from "../../domain/event/RideCompletedEvent";
import DatabaseConnection from "../../infra/database/DatabaseConnection";
import AccountGateway from "../gateway/AccountGateway";

export default class UpdateRideProjectionAPIComposition {

	constructor (readonly connection: DatabaseConnection, readonly accountGateway: AccountGateway) {
	}

	async execute (input: RideCompletedEvent): Promise<void> {
		const [rideData] = await this.connection.query(`
			select
				r.ride_id,
				r.fare,
				r.distance,
				r.status,
				r.passenger_id,
				r.driver_id
			from
				cccat14.ride r
			where
				r.ride_id = $1
		`,[
			input.rideId
		]);
		const passenger = await this.accountGateway.getById(rideData.passenger_id);
		let driver;
		if (rideData.driver_id) {
			driver = await this.accountGateway.getById(rideData.driver_id);
		}
		await this.connection.query("insert into cccat14.ride_projection (ride_id, passenger_id, driver_id, fare, distance, status, passenger_name, passenger_cpf, driver_name, driver_cpf, driver_car_plate) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [rideData.ride_id, rideData.passenger_id, rideData.driver_id, parseFloat(rideData.fare), parseFloat(rideData.distance), rideData.status, passenger.name, passenger.cpf, driver.name, driver.cpf, driver.carPlate]);
	}
}

