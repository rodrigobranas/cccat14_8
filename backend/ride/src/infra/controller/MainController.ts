import AccountRepositoryDatabase from "../repository/AccountRepositoryDatabase";
import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "../http/HttpServer";
import LoggerConsole from "../logger/LoggerConsole";
import PgPromiseAdapter from "../database/PgPromiseAdapter";
import Signup, { Input } from "../../application/usecase/Signup";

// Interface Adapter
export default class MainController {

	constructor (readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount) {
		httpServer.register("post", "/signup", async function (params: any, body: any) {
			const output = await signup.execute(body);
			return output;
		});

		httpServer.register("get", "/accounts/:accountId", async function (params: any, body: any) {
			const output = await getAccount.execute(params.accountId);
			return output;
		})
	}
}