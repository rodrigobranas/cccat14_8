import Account from "../../domain/Account";
import AccountRepository from "../../application/repository/AccountRepository";
import DatabaseConnection from "../database/DatabaseConnection";

// Interface Adapters
export default class AccountRepositoryDatabase implements AccountRepository {

	constructor (readonly connection: DatabaseConnection) {
	}

	async save (account: Account) {
		await this.connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
	}

	async getById (accountId: string): Promise<Account | undefined> {
		const [account] = await this.connection.query("select * from cccat14.account where account_id = $1", [accountId]);
		if (!account) return undefined;
		return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
	}
	
	async getByEmail (email: string): Promise<Account | undefined> {
		const [account] = await this.connection.query("select * from cccat14.account where email = $1", [email]);
		if (!account) return undefined;
		return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
	}
}
