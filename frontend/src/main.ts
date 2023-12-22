import { createApp } from 'vue'
import App from "./App.vue";
import './style.css'
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp';
import FetchAdapter from './infra/http/FetchAdapter';

const app = createApp(App);
const httpClient = new FetchAdapter();
const accountGateway = new AccountGatewayHttp(httpClient);
app.provide("accountGateway", accountGateway);
app.mount('#app');
