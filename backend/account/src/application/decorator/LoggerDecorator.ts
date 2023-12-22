import UseCase from "../usecase/UseCase";

export default class LoggerDecorator implements UseCase {
	name = "loggerDecorator";

	constructor (readonly usecase: UseCase) {
	}

	async execute(input: any): Promise<any> {
		console.log(this.usecase.name, input);
		return this.usecase.execute(input);
	}

}
