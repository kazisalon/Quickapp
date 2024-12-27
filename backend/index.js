const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
let todos = [
	{ id: 1, title: "Learn Vue.js", completed: false },
	{ id: 2, title: "Learn Express.js", completed: true },
];

// Root route
app.get("/", (req, res) => {
	res.send("Todo API is running");
});

// GET all todos
app.get("/api/todos", (req, res) => {
	try {
		res.json(todos);
	} catch (error) {
		res.status(500).json({ error: "Error fetching todos" });
	}
});

// POST new todo
app.post("/api/todos", (req, res) => {
	try {
		if (!req.body.title) {
			return res.status(400).json({ error: "Title is required" });
		}

		const newTodo = {
			id: Date.now(),
			title: req.body.title,
			completed: false,
		};
		todos.push(newTodo);
		res.status(201).json(newTodo);
	} catch (error) {
		res.status(500).json({ error: "Error creating todo" });
	}
});

// DELETE todo
app.delete("/api/todos/:id", (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const initialLength = todos.length;
		todos = todos.filter((todo) => todo.id !== id);

		if (todos.length === initialLength) {
			return res.status(404).json({ error: "Todo not found" });
		}

		res.status(200).json({ message: "Todo deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting todo" });
	}
});

// Toggle todo completion
app.patch("/api/todos/:id", (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const todo = todos.find((todo) => todo.id === id);

		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		todo.completed = !todo.completed;
		res.json(todo);
	} catch (error) {
		res.status(500).json({ error: "Error updating todo" });
	}
});

// Error handling for undefined routes
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
	console.log(`Test the API by visiting http://localhost:${port}/api/todos`);
});
