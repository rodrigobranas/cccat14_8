import AccountRepositoryDatabase from "../repository/AccountRepositoryDatabase";
import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "../http/HttpServer";
import LoggerConsole from "../logger/LoggerConsole";
import PgPromiseAdapter from "../database/PgPromiseAdapter";
import Signup, { Input } from "../../application/usecase/Signup";
import Registry, { inject } from "../di/Registry";

// Interface Adapter
export default class MainController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("signup")
	signup?: Signup;
	@inject("getAccount")
	getAccount?: GetAccount;

	constructor () {

		this.httpServer?.register("post", "/signup", async (params: any, body: any) => {
			const output = await this.signup?.execute(body);
			return output;
		});

		this.httpServer?.register("get", "/accounts/:accountId", async (params: any, body: any) => {
			const output = await this.getAccount?.execute(params.accountId);
			return output;
		})
	}
}