import ExpressAdapter from "./infra/http/ExpressAdapter";
import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Registry from "./infra/di/Registry";
import Queue from "./infra/queue/Queue";
import SendReceipt from "./application/usecase/SendReceipt";
import QueueController from "./infra/queue/QueueController";
import RequestRide from "./application/usecase/RequestRide";
import RideRepositoryDatabase from "./infra/repository/RideRepositoryDatabase";
import AccountGatewayHttp from "./infra/gateway/AccountGatewayHttp";

// composition root ou entry point
// criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const queue = new Queue();
const rideRepository = new RideRepositoryDatabase(databaseConnection);
const accountGateway = new AccountGatewayHttp();

// interface adapter
const logger = new LoggerConsole();

// use case
const sendReceipt = new SendReceipt();
const requestRide = new RequestRide(rideRepository, accountGateway, logger);

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);
registry.register("queue", queue);
registry.register("sendReceipt", sendReceipt);
registry.register("requestRide", requestRide);

new MainController();
new QueueController();
httpServer.listen(3000);
