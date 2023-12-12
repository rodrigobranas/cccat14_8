import axios from "axios";
import crypto from "crypto";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve processar um pagamento", async function () {
	const rideId = crypto.randomUUID();
	const inputProcessPayment = {
		rideId,
		creditCardToken: "123456789",
		amount: 1000
	};
	await axios.post("http://localhost:3002/process_payment", inputProcessPayment);
	const response = await axios.get(`http://localhost:3002/rides/${rideId}/transactions`);
	const output = response.data;
	expect(output.rideId).toBe(rideId);
	expect(output.status).toBe("paid");
});
