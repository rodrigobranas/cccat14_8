import Transaction from "../../domain/Transaction";

export default interface TransactionRepository {
	save (transaction: Transaction): Promise<void>;
	getByRideId (rideId: string): Promise<Transaction>;
}
