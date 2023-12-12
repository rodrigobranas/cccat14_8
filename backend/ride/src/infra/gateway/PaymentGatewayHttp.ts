import PaymentGateway from "../../application/gateway/PaymentGateway";
import axios from "axios";

export default class PaymentGatewayHttp implements PaymentGateway {

	async processPayment(input: any): Promise<any> {
		await axios.post("http://localhost:3002/process_payment", input);
	}

}