import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import AccountGateway from "../src/application/gateway/AccountGateway";
import AxiosAdapter from "../src/infra/http/AxiosAdapter";
import FetchAdapter from "../src/infra/http/FetchAdapter";


let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: DatabaseConnection;
let accountGateway: AccountGateway;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	// const httpClient = new AxiosAdapter();
	const httpClient = new FetchAdapter();
	accountGateway = new AccountGatewayHttp(httpClient);
	requestRide = new RequestRide(rideRepository, accountGateway, logger);
	getRide = new GetRide(rideRepository, positionRepository, logger);
})

test.only("Deve solicitar uma corrida", async function () {
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
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("requested");
});

test("Não deve poder solicitar uma corrida se a conta não existir", async function () {
	const inputRequestRide = {
		passengerId: "5fd82c60-ff7c-40d0-9bb8-f56d6836f1aa",
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account not found"));
});

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true,
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
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Only passengers can request a ride"));
});

test("Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa", async function () {
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
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow("Passenger has an active ride");
});

afterEach(async () => {
	await databaseConnection.close();
});
