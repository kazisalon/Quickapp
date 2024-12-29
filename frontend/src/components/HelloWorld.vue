<template>
	<!-- Main container -->
	<div class="app-container">
		<h1>Todo List</h1>

		<!-- 1. Input Section -->
		<div class="add-todo">
			<!-- Input for new todos -->
			<input v-model="newTodo" <!-- Connects input to newTodo data -- />
			@keyup.enter="addTodo"
			<!-- Call addTodo when Enter is pressed -->
			placeholder="Add a new todo..." >
			<!-- Add button -->
			<button @click="addTodo">Add</button>
		</div>

		<!-- 2. Todo List Section -->
		<div class="todo-list">
			<!-- Loop through each todo -->
			<div v-for="todo in todos" :key="todo.id" class="todo-item">
				<div class="todo-content">
					<!-- Checkbox for completion -->
					<input
						type="checkbox"
						:checked="todo.completed"
						@click="toggleTodo(todo.id)"
					/>
					<!-- Todo text -->
					<span :class="{ completed: todo.completed }">
						{{ todo.title }}
					</span>
				</div>
				<!-- Delete button -->
				<button @click="deleteTodo(todo.id)" class="delete-btn">Delete</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	// 1. Data section - stores our component's data
	data() {
		return {
			todos: [], // Array to store todos
			newTodo: "", // Store new todo input text
		};
	},

	// 2. Mounted - runs when component is created
	mounted() {
		this.fetchTodos(); // Load todos when page loads
	},

	// 3. Methods - contains all our functions
	methods: {
		// Fetch all todos from backend
		async fetchTodos() {
			try {
				const response = await fetch("http://localhost:3000/api/todos");
				this.todos = await response.json();
			} catch (error) {
				console.error("Error fetching todos:", error);
			}
		},

		// Add a new todo
		async addTodo() {
			if (!this.newTodo.trim()) return; // Don't add empty todos

			try {
				const response = await fetch("http://localhost:3000/api/todos", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ title: this.newTodo }),
				});
				const newTodo = await response.json();
				this.todos.push(newTodo); // Add new todo to list
				this.newTodo = ""; // Clear input field
			} catch (error) {
				console.error("Error adding todo:", error);
			}
		},

		// Toggle todo completion
		async toggleTodo(id) {
			try {
				const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
					method: "PATCH",
				});
				const updatedTodo = await response.json();
				// Find and update the todo in our list
				const index = this.todos.findIndex((todo) => todo.id === id);
				this.todos[index] = updatedTodo;
			} catch (error) {
				console.error("Error toggling todo:", error);
			}
		},

		// Delete a todo
		async deleteTodo(id) {
			try {
				await fetch(`http://localhost:3000/api/todos/${id}`, {
					method: "DELETE",
				});
				// Remove todo from our list
				this.todos = this.todos.filter((todo) => todo.id !== id);
			} catch (error) {
				console.error("Error deleting todo:", error);
			}
		},
	},
};
</script>

<style>
/* Basic styles for the app */
.app-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
}

h1 {
	text-align: center;
	color: #333;
}

/* Styles for the add todo section */
.add-todo {
	margin: 20px 0;
	display: flex;
	gap: 10px;
}

.add-todo input {
	flex: 1;
	padding: 8px;
	border: 1px solid #ddd;
	border-radius: 4px;
}

/* Button styles */
button {
	padding: 8px 16px;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:hover {
	background-color: #45a049;
}

/* Todo list styles */
.todo-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.todo-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
}

.todo-content {
	display: flex;
	align-items: center;
	gap: 10px;
}

/* Style for completed todos */
.completed {
	text-decoration: line-through;
	color: #888;
}

/* Delete button style */
.delete-btn {
	background-color: #f44336;
}

.delete-btn:hover {
	background-color: #da190b;
}
</style>
