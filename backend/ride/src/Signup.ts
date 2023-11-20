import crypto from "crypto";
import AccountDAO from "./AccountRepository";
import { validateCpf } from "./CpfValidator";
import Logger from "./Logger";
import SignupAccountDAO from "./SignupAccountDAO";
import Account from "./Account";

export default class Signup {

	constructor (private accountDAO: SignupAccountDAO, private logger: Logger) {
	}

	async execute (input: any) {
		this.logger.log(`signup ${input.name}`);
		const existingAccount = await this.accountDAO.getByEmail(input.email);
		if (existingAccount) throw new Error("Duplicated account");
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver);
		await this.accountDAO.save(account);
		return {
			accountId: account.accountId
		};
	}

}
