export default class Observable {
	private listeners: { callback: Function }[];

	constructor () {
		this.listeners = [];
	}

	register (callback: Function){
		this.listeners.push({ callback });
	}

	notify (event: any) {
		for (const listener of this.listeners) {
			listener.callback(event);
		}
	}
}
