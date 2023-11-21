import AcceptRide from "../src/application/usecase/AcceptRide";
import AccountDAO from "../src/application/repository/AccountRepository";
import AccountDAODatabase from "../src/infra/repository/AccountRepositoryDatabase";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import Logger from "../src/application/logger/Logger";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import RideDAODatabase from "../src/infra/repository/RideRepositoryDatabase";
import Signup from "../src/application/usecase/Signup";
import sinon from "sinon";
import StartRide from "../src/application/usecase/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";


let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountDAO = new AccountDAODatabase(databaseConnection);
	const rideDAO = new RideDAODatabase();
	const logger = new LoggerConsole();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDAO, accountDAO, logger);
	getRide = new GetRide(rideDAO, logger);
	acceptRide = new AcceptRide(rideDAO, accountDAO);
	startRide = new StartRide(rideDAO);
})

test("Deve iniciar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true,
		password: "123456"
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const inputStartRide = {
		rideId: outputRequestRide.rideId
	};
	await startRide.execute(inputStartRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("in_progress");
});

afterEach(async () => {
	await databaseConnection.close();
});