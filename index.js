// To-Do List Application
class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.init();
  }

  init() {
    // DOM Elements
    this.taskInput = document.getElementById("taskInput");
    this.addBtn = document.getElementById("addBtn");
    this.taskList = document.getElementById("taskList");
    this.filterSelect = document.getElementById("filterSelect");
    this.themeToggle = document.getElementById("themeToggle");
    this.taskCount = document.getElementById("taskCount");

    // Event Listeners
    this.addBtn.addEventListener("click", () => this.addTask());
    this.taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });
    this.filterSelect.addEventListener("change", () => this.renderTasks());
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
    this.taskList.addEventListener("click", (e) => this.handleListClick(e));
    this.taskList.addEventListener("change", (e) =>
      this.handleCheckboxChange(e)
    );

    // Initial Render
    this.renderTasks();
  }

  addTask() {
    const text = this.taskInput.value.trim();
    if (text) {
      this.tasks.push({
        id: Date.now(),
        text,
        completed: false,
      });
      this.taskInput.value = "";
      this.saveTasks();
      this.renderTasks();
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();
    this.renderTasks();
  }

  toggleComplete(taskId) {
    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    this.saveTasks();
    this.renderTasks();
  }

  handleListClick(e) {
    // Handle delete button clicks
    if (e.target.closest(".delete-btn")) {
      const taskId = parseInt(e.target.closest(".task-item").dataset.id);
      this.deleteTask(taskId);
    }
  }

  handleCheckboxChange(e) {
    // Handle checkbox changes
    if (e.target.classList.contains("task-checkbox")) {
      const taskId = parseInt(e.target.closest(".task-item").dataset.id);
      this.toggleComplete(taskId);
    }
  }

  renderTasks() {
    const filter = this.filterSelect.value;
    const filteredTasks = this.tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });

    // Render tasks
    this.taskList.innerHTML =
      filteredTasks.length > 0
        ? filteredTasks
            .map(
              (task) => `
                <li class="task-item ${
                  task.completed ? "completed" : ""
                }" data-id="${task.id}">
                    <input type="checkbox" 
                           class="task-checkbox" 
                           ${task.completed ? "checked" : ""}>
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            `
            )
            .join("")
        : `<div class="empty-state">Stay productive! Add your first task.</div>`;

    // Update task counter
    this.taskCount.textContent = `${
      this.tasks.filter((t) => !t.completed).length
    } tasks remaining`;
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  toggleTheme() {
    document.body.classList.toggle("dark-theme");
    this.themeToggle.innerHTML = document.body.classList.contains("dark-theme")
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }
}

// Initialize the application
const todoApp = new TodoApp();
