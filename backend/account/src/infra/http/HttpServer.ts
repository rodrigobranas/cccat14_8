export default interface HttpServer {
	register (method: string, url: string, callback: Function): void;
	listen (port: number): void;
}
