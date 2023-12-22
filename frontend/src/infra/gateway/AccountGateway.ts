export default interface AccountGateway {
	signup (input: Input): Promise<Output>;
}

export type Input = {
	isPassenger: boolean,
	isDriver: boolean,
	name: string,
	email: string,
	cpf: string,
	carPlate: string
}

export type Output = {
	accountId: string
}
