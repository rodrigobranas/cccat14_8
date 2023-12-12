import AccountGateway from "../../application/gateway/AccountGateway";
import axios from "axios";

export default class AccountGatewayHttp implements AccountGateway {

	async signup(input: any): Promise<any> {
		const response = await axios.post("http://localhost:3004/signup", input);
		return response.data; 
	}

	async getById(accountId: string): Promise<any> {
		const response = await axios.get(`http://localhost:3001/accounts/${accountId}`);
		return response.data;
	}

}
