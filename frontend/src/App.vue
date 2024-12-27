<template>
	<div class="app-container">
		<h1>Todo List</h1>

		<!-- Add Todo Form -->
		<div class="add-todo">
			<input
				v-model="newTodo"
				@keyup.enter="addTodo"
				placeholder="Add a new todo..."
			/>
			<button @click="addTodo">Add</button>
		</div>

		<!-- Todo List -->
		<div class="todo-list">
			<div v-for="todo in todos" :key="todo.id" class="todo-item">
				<div class="todo-content">
					<input
						type="checkbox"
						:checked="todo.completed"
						@click="toggleTodo(todo.id)"
					/>
					<span :class="{ completed: todo.completed }">
						{{ todo.title }}
					</span>
				</div>
				<button @click="deleteTodo(todo.id)" class="delete-btn">Delete</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			todos: [],
			newTodo: "",
		};
	},

	mounted() {
		this.fetchTodos();
	},

	methods: {
		async fetchTodos() {
			try {
				const response = await fetch("http://localhost:3000/api/todos");
				this.todos = await response.json();
			} catch (error) {
				console.error("Error fetching todos:", error);
			}
		},

		async addTodo() {
			if (!this.newTodo.trim()) return;

			try {
				const response = await fetch("http://localhost:3000/api/todos", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ title: this.newTodo }),
				});
				const newTodo = await response.json();
				this.todos.push(newTodo);
				this.newTodo = "";
			} catch (error) {
				console.error("Error adding todo:", error);
			}
		},

		async toggleTodo(id) {
			try {
				const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
					method: "PATCH",
				});
				const updatedTodo = await response.json();
				const index = this.todos.findIndex((todo) => todo.id === id);
				this.todos[index] = updatedTodo;
			} catch (error) {
				console.error("Error toggling todo:", error);
			}
		},

		async deleteTodo(id) {
			try {
				await fetch(`http://localhost:3000/api/todos/${id}`, {
					method: "DELETE",
				});
				this.todos = this.todos.filter((todo) => todo.id !== id);
			} catch (error) {
				console.error("Error deleting todo:", error);
			}
		},
	},
};
</script>

<style>
.app-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
}

h1 {
	text-align: center;
	color: #333;
}

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

.completed {
	text-decoration: line-through;
	color: #888;
}

.delete-btn {
	background-color: #f44336;
}

.delete-btn:hover {
	background-color: #da190b;
}
</style>
