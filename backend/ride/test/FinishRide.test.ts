import AcceptRide from "../src/application/usecase/AcceptRide";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import Signup from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import FinishRide from "../src/application/usecase/FinishRide";


let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: DatabaseConnection;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(databaseConnection);
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	signup = new Signup(accountRepository, logger);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideRepository, accountRepository, logger);
	getRide = new GetRide(rideRepository, positionRepository, logger);
	acceptRide = new AcceptRide(rideRepository, accountRepository);
	startRide = new StartRide(rideRepository);
	updatePosition = new UpdatePosition(rideRepository, positionRepository);
	finishRide = new FinishRide(rideRepository, positionRepository);
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
	const inputUpdatePosition1 = {
		rideId: outputRequestRide.rideId,
		lat: -27.584905257808835,
		long: -48.545022195325124
	};
	await updatePosition.execute(inputUpdatePosition1);
	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: -27.496887588317275,
		long: -48.522234807851476
	};
	await updatePosition.execute(inputUpdatePosition2);
	const inputFinishRide = {
		rideId: outputRequestRide.rideId
	};
	await finishRide.execute(inputFinishRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("completed");
	expect(outputGetRide.distance).toBe(10);
	expect(outputGetRide.fare).toBe(21);
});

afterEach(async () => {
	await databaseConnection.close();
});