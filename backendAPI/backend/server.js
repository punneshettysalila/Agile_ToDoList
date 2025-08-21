const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory tasks storage
let tasks = [];
let idCounter = 1;

// Routes

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Task name is required' });
  }
  const task = { id: idCounter++, name, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Update a task (name/completed)
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, completed } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (name !== undefined) task.name = name;
  if (completed !== undefined) task.completed = completed;
  res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
