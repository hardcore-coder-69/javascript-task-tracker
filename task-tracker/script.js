const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.getElementById("filter-buttons");
let tasks = [];

addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskDescription = taskInput.value;
    if (taskDescription.trim() !== '') {
        const task = {
            description: taskDescription,
            completed: false,
            createdAt: new Date()
        };
        tasks.push(task);
        renderTasks();
        taskInput.value = '';
    }
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
          <div class="task-is">
            <input type="checkbox" onchange="toggleTaskCompleted(${index})" ${task.completed ? 'checked' : ''}>
            <span class="${task.completed ? 'line-through' : ''}">${task.description}</span>
          </div>
          <i class="fa fa-trash delete" onclick="deleteTask(${index})"></i>
        `;
        taskList.appendChild(taskItem);
    });

    if (tasks.length === 0) {
        taskList.innerHTML = `<div class="no-tasks">
            <i class="fa fa-file italic margin-right"></i>
            No tasks found
        </div>`
    }
}
function toggleTaskCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function filterTasks(filter) {
    let filteredTasks = [];
    if (filter === 'all') {
        filteredTasks = tasks;
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    highlightTab(filter)
    renderFilteredTasks(filteredTasks);
}

function highlightTab(filter) {
    const buttons = filterButtons.querySelectorAll("button")
    buttons.forEach(button => {
        const id = button.getAttribute("id")
        if (id == filter) {
            button.classList.add("active")
        } else {
            button.classList.remove("active")
        }
    })
}

function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
            <div class="task-is">
                <input type="checkbox" onchange="toggleTaskCompleted(${tasks.indexOf(task)})" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'line-through' : ''}">${task.description}</span>
            </div>
            <i onclick="deleteTask(${tasks.indexOf(task)})" class="fa fa-trash delete"></i>
        `;
        taskList.appendChild(taskItem);
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<div class="no-tasks">
        <i class="fa fa-file italic margin-right"></i>
            No tasks found
        </div>`
    }
}

function archiveTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

function loadSavedTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        tasks = savedTasks;
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load saved tasks when the page loads
window.addEventListener('load', loadSavedTasks);

// Save tasks whenever tasks array is updated
window.addEventListener('beforeunload', saveTasks);