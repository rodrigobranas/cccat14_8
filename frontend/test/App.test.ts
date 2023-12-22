import { mount } from "@vue/test-utils";
import AppVue from "../src/App.vue";
import AccountGateway from "../src/infra/gateway/AccountGateway";

async function sleep (time: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
}

let wrapper: any;

beforeEach(() => {
	const accountGateway: AccountGateway = {
		async signup (input: any): Promise<any> {
			return { accountId: "abc" };
		}
	}
	wrapper = mount(AppVue, {
		global: {
			provide: {
				accountGateway
			}
		}
	});
})

test("Deve testar o componente de Signup", async function () {
	const name = "John Doe";
	const email = `john.doe${Math.random()}@gmail.com`;
	const cpf = "97456321558";
	const carPlate = "AAA9999";
	await wrapper.get("#is-passenger").setValue(true);
	await wrapper.get("#is-driver").setValue(true);
	await wrapper.get("#next-button").trigger("click");
	await wrapper.get("#input-name").setValue(name);
	await wrapper.get("#input-email").setValue(email);
	await wrapper.get("#input-cpf").setValue(cpf);
	await wrapper.get("#input-car-plate").setValue(carPlate);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#name").text()).toBe(`Name: ${name}`);
	expect(wrapper.get("#email").text()).toBe(`Email: ${email}`);
	expect(wrapper.get("#cpf").text()).toBe(`Cpf: ${cpf}`);
	expect(wrapper.get("#car-plate").text()).toBe(`Car Plate: ${carPlate}`);
	await wrapper.get("#submit-button").trigger("click");
	await sleep(200);
	expect(wrapper.get("#account-id")).toBeDefined();
});

test("Deve testar o fluxo do wizard", async function () {
	await wrapper.get("#is-passenger").setValue(true);
	const name = "John Doe";
	const email = `john.doe${Math.random()}@gmail.com`;
	const cpf = "97456321558";
	const carPlate = "AAA9999";
	expect(wrapper.get("#step").text()).toBe("Step 1");
	expect(wrapper.find("#previous-button").exists()).toBe(false);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#step").text()).toBe("Step 2");
	await wrapper.get("#input-name").setValue(name);
	await wrapper.get("#input-email").setValue(email);
	await wrapper.get("#input-cpf").setValue(cpf);
	expect(wrapper.find("#input-car-plate").exists()).toBe(false);
	await wrapper.get("#previous-button").trigger("click");
	await wrapper.get("#is-driver").setValue(true);
	await wrapper.get("#next-button").trigger("click");
	await wrapper.get("#input-car-plate").setValue(carPlate);
	expect(wrapper.find("#input-car-plate").exists()).toBe(true);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#step").text()).toBe("Step 3");
	expect(wrapper.find("#next-button").exists()).toBe(false);
	await wrapper.get("#previous-button").trigger("click");
	expect(wrapper.get("#step").text()).toBe("Step 2");
	await wrapper.get("#previous-button").trigger("click");
	expect(wrapper.get("#step").text()).toBe("Step 1");
});

test("Não deve ir para o passo 2 se pelo menos uma opção (passenger ou driver) não estiver marcada", async function () {
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#step").text()).toBe("Step 1");
	expect(wrapper.get("#error").text()).toBe("Select at least one option");
	await wrapper.get("#is-passenger").setValue(true);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#error").text()).toBe("");
});

test("Não deve ir para o passo 3 se os campos nome, email, cpf e placa do carro (se for motorista) não estiverem preenchidos", async function () {
	const name = "John Doe";
	const email = `john.doe${Math.random()}@gmail.com`;
	const cpf = "97456321558";
	const carPlate = "AAA9999";
	expect(wrapper.get("#step").text()).toBe("Step 1");
	await wrapper.get("#is-passenger").setValue(true);
	await wrapper.get("#is-driver").setValue(true);
	expect(wrapper.find("#previous-button").exists()).toBe(false);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#step").text()).toBe("Step 2");
	await wrapper.get("#input-name").setValue("");
	await wrapper.get("#input-email").setValue("");
	await wrapper.get("#input-cpf").setValue("");
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#error").text()).toBe("Invalid name");
	await wrapper.get("#input-name").setValue(name);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#error").text()).toBe("Invalid email");
	await wrapper.get("#input-email").setValue(email);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#error").text()).toBe("Invalid cpf");
	await wrapper.get("#input-cpf").setValue(cpf);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#error").text()).toBe("Invalid car plate");
	await wrapper.get("#input-car-plate").setValue(carPlate);
	await wrapper.get("#next-button").trigger("click");
	expect(wrapper.get("#error").text()).toBe("");
	expect(wrapper.get("#step").text()).toBe("Step 3");
});
