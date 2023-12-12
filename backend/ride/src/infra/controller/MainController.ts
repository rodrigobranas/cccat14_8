import HttpServer from "../http/HttpServer";
import Registry, { inject } from "../di/Registry";
import RequestRide from "../../application/usecase/RequestRide";
import Queue from "../queue/Queue";

// Interface Adapter
export default class MainController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("requestRide")
	requestRide?: RequestRide;
	@inject("queue")
	queue?: Queue;

	constructor () {

		this.httpServer?.register("post", "/request_ride", async (params: any, body: any) => {
			const output = await this.requestRide?.execute(body);
			return output;
		});

		this.httpServer?.register("post", "/request_ride_async", async (params: any, body: any) => {
			await this.queue?.publish("requestRide", body);
		});

	}

}
