// 1. First, we import the tools we need
const express = require("express"); // Main framework for building the server
const cors = require("cors"); // Allows our frontend to talk to backend
const app = express(); // Create our server app
const port = 3000; // The door number our server will use

// 2. Set up middleware (tools that process requests)
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Let us read JSON data from requests

// 3. Create our fake database (we'll use a simple array for now)
let todos = [
	{ id: 1, title: "Learn Vue.js", completed: false },
	{ id: 2, title: "Learn Express.js", completed: true },
];

// 4. Create routes (paths) for different actions:

// 4a. Homepage route - Just to check if server is running
app.get("/", (req, res) => {
	res.send("Todo API is running");
});

// 4b. GET route - Send all todos to frontend
app.get("/api/todos", (req, res) => {
	try {
		res.json(todos); // Send todos list
	} catch (error) {
		res.status(500).json({ error: "Error fetching todos" });
	}
});

// 4c. POST route - Add a new todo
app.post("/api/todos", (req, res) => {
	try {
		// Check if title was provided
		if (!req.body.title) {
			return res.status(400).json({ error: "Title is required" });
		}

		// Create new todo
		const newTodo = {
			id: Date.now(), // Use current timestamp as ID
			title: req.body.title, // Get title from request
			completed: false, // New todos start as not completed
		};

		// Add to our list
		todos.push(newTodo);

		// Send back the new todo
		res.status(201).json(newTodo);
	} catch (error) {
		res.status(500).json({ error: "Error creating todo" });
	}
});

// 4d. DELETE route - Remove a todo
app.delete("/api/todos/:id", (req, res) => {
	try {
		const id = parseInt(req.params.id); // Get ID from URL

		// Remove todo with matching ID
		const initialLength = todos.length;
		todos = todos.filter((todo) => todo.id !== id);

		// Check if anything was actually deleted
		if (todos.length === initialLength) {
			return res.status(404).json({ error: "Todo not found" });
		}

		res.status(200).json({ message: "Todo deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting todo" });
	}
});

// 4e. PATCH route - Toggle todo completion
app.patch("/api/todos/:id", (req, res) => {
	try {
		const id = parseInt(req.params.id); // Get ID from URL
		const todo = todos.find((todo) => todo.id === id); // Find the todo

		// If todo wasn't found
		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		// Toggle completion status
		todo.completed = !todo.completed;

		// Send back updated todo
		res.json(todo);
	} catch (error) {
		res.status(500).json({ error: "Error updating todo" });
	}
});

// 5. Handle 404 errors for any other routes
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// 6. Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
