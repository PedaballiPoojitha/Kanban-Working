
const columns = document.querySelectorAll(".column");
let draggedTask = null;

// Load saved tasks
document.addEventListener("DOMContentLoaded", loadTasks);

columns.forEach(column => {
  const addBtn = column.querySelector("button");
  const input = column.querySelector("input");
  const taskList = column.querySelector(".task-list");

  addBtn.addEventListener("click", () => {
    if (input.value.trim() !== "") {
      const task = createTask(input.value, column.dataset.status);
      taskList.appendChild(task);
      saveTasks();
      input.value = "";
    }
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (draggedTask) {
      taskList.appendChild(draggedTask);
    }
  });
});

function createTask(text, status) {
  const task = document.createElement("div");
  task.className = "task";
  task.setAttribute("draggable", "true");

  const span = document.createElement("span");
  span.textContent = text;

  const btnContainer = document.createElement("div");
  btnContainer.className = "task-buttons";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete-btn";

  btnContainer.append(editBtn, deleteBtn);
  task.append(span, btnContainer);

  // Drag Events
  task.addEventListener("dragstart", () => {
    draggedTask = task;
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
    draggedTask = null;
    saveTasks();
  });

  // Edit Task
  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit task:", span.textContent);
    if (newText) {
      span.textContent = newText;
      saveTasks();
    }
  });

  // Delete Task
  deleteBtn.addEventListener("click", () => {
    task.remove();
    saveTasks();
  });

  return task;
}

// Save to LocalStorage
function saveTasks() {
  const data = {};

  columns.forEach(column => {
    const status = column.dataset.status;
    const tasks = [];
    column.querySelectorAll(".task span").forEach(task => {
      tasks.push(task.textContent);
    });
    data[status] = tasks;
  });

  localStorage.setItem("kanbanData", JSON.stringify(data));
}

// Load from LocalStorage
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("kanbanData"));
  if (!data) return;

  columns.forEach(column => {
    const status = column.dataset.status;
    const taskList = column.querySelector(".task-list");

    if (data[status]) {
      data[status].forEach(text => {
        const task = createTask(text, status);
        taskList.appendChild(task);
      });
    }
  });
}
