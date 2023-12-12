import DatabaseConnection from "./DatabaseConnection";
import pgp from "pg-promise";

// Framework and Driver and Library
export default class PgPromiseAdapter implements DatabaseConnection {
	connection: any;

	constructor () {
		this.connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	}
	
	query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}
	
	async close(): Promise<void> {
		await this.connection.$pool.end();
	}

}
