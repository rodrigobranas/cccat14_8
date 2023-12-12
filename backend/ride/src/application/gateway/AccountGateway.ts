export default interface AccountGateway {
	signup (input: any): Promise<any>;
	getById (accountId: string): Promise<any>;
}
