import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import AccountGateway from "../src/application/gateway/AccountGateway";
import axios from "axios";


let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: DatabaseConnection;
let accountGateway: AccountGateway;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	accountGateway = new AccountGatewayHttp();
	requestRide = new RequestRide(rideRepository, accountGateway, logger);
	getRide = new GetRide(rideRepository, positionRepository, logger);
})

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	// const outputRequestRide = await requestRide.execute(inputRequestRide);
	await axios.post("http://localhost:3000/request_ride_async", inputRequestRide);
	// const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	// expect(outputGetRide.status).toBe("requested");
});

afterEach(async () => {
	await databaseConnection.close();
});
