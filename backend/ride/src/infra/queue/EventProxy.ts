import Aggregate from "../../domain/Aggregate";
import DomainEvent from "../../domain/event/DomainEvent";
import Queue from "./Queue";

export default class EventProxy {
	static createProxy (aggregate: Aggregate, queue: Queue) {
		aggregate.register(function (event: DomainEvent) {
			queue.publish(event.name, event);
		});
		return new Proxy(aggregate, {
			get (target: any, propertyKey: string) {
				return target[propertyKey];
			}
		})
	}
}
