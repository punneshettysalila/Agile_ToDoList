const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

const API_URL = 'http://localhost:3000/tasks';

// Fetch tasks (with optional filter)
async function fetchTasks(filter = '') {
  const response = await fetch(API_URL);
  let tasks = await response.json();
  if (filter) {
    tasks = tasks.filter(task => task.name.toLowerCase().includes(filter.toLowerCase()));
  }
  return tasks;
}

// Render tasks with supplied filter
async function renderTasks(filter = '') {
  const tasks = await fetchTasks(filter);
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.name;
    if (task.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: checkbox.checked }),
      });
      renderTasks(filter);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'editBtn';
    editBtn.addEventListener('click', async () => {
      const newTask = prompt('Edit task:', task.name);
      if (newTask) {
        await fetch(`${API_URL}/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newTask }),
        });
        renderTasks(filter);
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.addEventListener('click', async () => {
      li.style.transition = 'opacity 0.4s ease';
      li.style.opacity = '0';

      setTimeout(async () => {
        await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
        renderTasks(filter);
      }, 400);
    });

    li.prepend(checkbox);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Add new task
addTaskBtn.addEventListener('click', async () => {
  const taskName = taskInput.value.trim();
  if (taskName) {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: taskName }),
    });
    taskInput.value = '';
    renderTasks(searchInput.value.trim());
  } else {
    alert('Please enter a task.');
  }
});

// Search input event to filter tasks
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.trim();
  renderTasks(filter);
});

// Initial render without filter
renderTasks();
