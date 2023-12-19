import AccountRepository from "../repository/AccountRepository";

async function sleep (time: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
}

export default class GetAccount {

	constructor (private accountRepository: AccountRepository) {
	}
	
	async execute (accountId: string): Promise<Output> {
		console.log("getAccount", accountId);
		const account = await this.accountRepository.getById(accountId);
		if (!account) throw new Error("Account not found");
		return {
			accountId: account.accountId,
			name: account.name.value,
			email: account.email.value,
			cpf: account.cpf.value,
			carPlate: account.carPlate.value,
			isPassenger: account.isPassenger,
			isDriver: account.isDriver
		};
	}
}

type Output = {
	accountId: string,
	name: string,
	email: string,
	cpf: string,
	carPlate: string,
	isPassenger: boolean,
	isDriver: boolean
}