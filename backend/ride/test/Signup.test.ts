import Account from "../src/domain/Account";
import AccountDAO from "../src/application/repository/AccountRepository";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GetAccount from "../src/application/usecase/GetAccount";
import Logger from "../src/application/logger/Logger";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import Signup from "../src/application/usecase/Signup";
import sinon from "sinon";


let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountDAO = new AccountRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
})

test("Deve criar uma conta para o passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
});

test("Deve criar uma conta para o passageiro com stub", async function () {
	const stubAccountDAOSave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	const stubAccountDAOGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves(undefined);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const stubAccountDAOGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(Account.create(inputSignup.name, inputSignup.email, inputSignup.cpf, "", inputSignup.isPassenger, false));
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
	stubAccountDAOSave.restore();
	stubAccountDAOGetByEmail.restore();
	stubAccountDAOGetById.restore();
});

test("Deve criar uma conta para o passageiro com mock", async function () {
	const mockLogger = sinon.mock(LoggerConsole.prototype);
	mockLogger.expects("log").withArgs("signup John Doe").once();
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
	mockLogger.verify();
	mockLogger.restore();
});

test("Não deve criar uma conta se o nome for inválido", async function () {
	// given
	const inputSignup = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta se o email for inválido", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta se o cpf for inválido", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "11111111111",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta se o email for duplicado", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await signup.execute(inputSignup);
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
});

test("Deve criar uma conta para o motorista", async function () {
	const spyLoggerLog = sinon.spy(LoggerConsole.prototype, "log");
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
	expect(spyLoggerLog.calledOnce).toBeTruthy();
	expect(spyLoggerLog.calledWith("signup John Doe")).toBeTruthy();
	spyLoggerLog.restore();
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Deve criar uma conta para o passageiro com fake", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const accounts: any = [];
	const accountDAO: AccountDAO = {
		async save (account: any): Promise<void> {
			accounts.push(account);
		},
		async getById (accountId: string): Promise<any> {
			return accounts.find((account: any) => account.accountId === accountId);
		},
		async getByEmail (email: string): Promise<any> {
			return accounts.find((account: any) => account.email === email);
		}
	}
	const logger: Logger = {
		log (message: string): void {
			console.log(message);
		}
	}
	const signup = new Signup(accountDAO, logger);
	const getAccount = new GetAccount(accountDAO);
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
});

afterEach(async () => {
	await databaseConnection.close();
});