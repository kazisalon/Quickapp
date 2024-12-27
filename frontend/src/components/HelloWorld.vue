<template>
	<div id="app">
		<h1>Welcome to QuickApp</h1>
		<p>{{ message }}</p>
	</div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
	name: "App",
	setup() {
		const message = ref(""); // Data binding to store the API response

		// Fetch data from the backend API
		const fetchMessage = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/message"); // Backend API URL
				const data = await response.json();
				message.value = data.message; // Update the message with the API response
			} catch (error) {
				message.value = "Error fetching data";
			}
		};

		onMounted(() => {
			fetchMessage(); // Call the API when the component is mounted
		});

		return { message };
	},
};
</script>

<style scoped>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
