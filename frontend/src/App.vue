<script setup lang="ts">
	import { inject, onMounted, ref } from 'vue';
	import AccountGateway from './infra/gateway/AccountGateway';
	import SignupComponentDomain from './domain/SignupComponentDomain';

	const signupForm = ref(new SignupComponentDomain());
	const accountId = ref("");

	let accountGateway: AccountGateway;

	signupForm.value.register(async function (event: any) {
		if (event.name === "submitted") {
			const input = event.data;
			const output = await accountGateway.signup(input);
			accountId.value = output.accountId;
		}
	});

	onMounted(() => {
		accountGateway = inject("accountGateway") as AccountGateway;
	});
</script>

<template>
	<div id="step">Step {{ signupForm.step }}</div>
	<br/>
	<div v-if="signupForm.step === 1">
		<div>
			<label>
				<input id="is-passenger" type="checkbox" v-model="signupForm.isPassenger">
				Passenger
			</label>
		</div>
		<div>
			<label>
				<input id="is-driver" type="checkbox" v-model="signupForm.isDriver">
				Driver
			</label>
		</div>
	</div>

	<div v-if="signupForm.step === 2">
		<div>
			<label>Name:</label>
			<div>
				<input id="input-name" type="text" v-model="signupForm.name">
			</div>
		</div>
		<div>
			<label>Email:</label>
			<div>
				<input id="input-email" type="text" v-model="signupForm.email">
			</div>
		</div>
		<div>
			<label @click="signupForm.setData()">Cpf:</label>
			<div>
				<input id="input-cpf" type="text" v-model="signupForm.cpf">
			</div>
		</div>
		<div v-if="signupForm.isDriver">
			<label>Car Plate:</label>
			<div>
				<input id="input-car-plate" type="text" v-model="signupForm.carPlate">
			</div>
		</div>
	</div>
	<div v-if="signupForm.step === 3">
		<div id="name">Name: {{ signupForm.name }}</div>
		<div id="email">Email: {{ signupForm.email }}</div>
		<div id="cpf">Cpf: {{ signupForm.cpf }}</div>
		<div v-if="signupForm.isDriver" id="car-plate">Car Plate: {{ signupForm.carPlate }}</div>
	</div>
	<div v-if="signupForm.step === 4">
		<div v-if="accountId" id="account-id">{{ accountId }}</div>
	</div>
	<br/>
	<button v-if="signupForm.isPreviousButtonVisible()" id="previous-button" @click="signupForm.previous()">Previous</button>
	<button v-if="signupForm.isNextButtonVisible()" id="next-button" @click="signupForm.next()">Next</button>
	<button v-if="signupForm.isSubmitButtonVisible()" id="submit-button" @click="signupForm.submit()">Submit</button>
	<div id="error">{{ signupForm.error }}</div>
</template>

<style>
</style>
