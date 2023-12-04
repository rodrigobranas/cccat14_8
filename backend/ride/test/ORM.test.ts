import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import ORM from "../src/infra/orm/ORM";
import TransactionModel from "../src/infra/orm/TransactionModel";
import crypto from "crypto";

test("Deve testar o ORM", async function () {
	const transactionId = crypto.randomUUID();
	const rideId = crypto.randomUUID();
	const transactionModel = new TransactionModel(transactionId, rideId, 100, new Date(), "waiting_payment");
	const connection = new PgPromiseAdapter();
	const orm = new ORM(connection);
	await orm.save(transactionModel);
	const savedTransactionModel = await orm.get(TransactionModel, "transaction_id", transactionId);
	expect(savedTransactionModel.transactionId).toBe(transactionId);
	expect(savedTransactionModel.rideId).toBe(rideId);
	expect(savedTransactionModel.status).toBe("waiting_payment");
	await connection.close();
});