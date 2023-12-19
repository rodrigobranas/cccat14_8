import DomainEvent from "./event/DomainEvent";

export default class Aggregate {
	private listeners: { callback: Function }[];

	constructor () {
		this.listeners = [];
	}

	register (callback: Function){
		this.listeners.push({ callback });
	}

	notify (event: DomainEvent) {
		for (const listener of this.listeners) {
			listener.callback(event);
		}
	}
}
