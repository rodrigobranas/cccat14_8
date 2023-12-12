import ExpressAdapter from "./infra/http/ExpressAdapter";
import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Registry from "./infra/di/Registry";
import TransactionRepositoryORM from "./infra/repository/TransactionRepositoryORM";
import ProcessPayment from "./application/usecase/ProcessPayment";
import GetTransactionByRideId from "./application/usecase/GetTransactionByRideId";
import QueueController from "./infra/queue/QueueController";
import Queue from "./infra/queue/Queue";

// composition root ou entry point
// criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const transactionRepository = new TransactionRepositoryORM(databaseConnection);

const queue = new Queue();
// interface adapter
const logger = new LoggerConsole();

// use case
const processPayment = new ProcessPayment(transactionRepository, queue);
const getTransactionByRideId = new GetTransactionByRideId(transactionRepository);

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);
registry.register("queue", queue);
registry.register("processPayment", processPayment);
registry.register("getTransactionByRideId", getTransactionByRideId);

new MainController();
new QueueController();
httpServer.listen(3002);
