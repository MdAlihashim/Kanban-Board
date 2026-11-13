// const todo = document.querySelector("#todo");
// const progress = document.querySelector("#progress");
// const done = document.querySelector("#done");
// const addTask = document.querySelector("#add-task");
// const createTask = document.querySelector("#create-task");
// const modal = document.querySelector(".modal");
// const modalBg = document.querySelector(".bg-modal");
// let draggedElem = null;
// let tasksData = {};

// const tasks = document.querySelectorAll(".task");

// tasks.forEach((task) => {
//   task.addEventListener("drag", (e) => {
//     draggedElem = task;
//   });
// });

// if (localStorage.getItem("tasks")) {
//   const data = JSON.parse(localStorage.getItem("tasks"));

//   for (const col in data) {
//     const column = document.querySelector(`#${col}`);
//     data[col].forEach(() => {
//       const taskTitle = document.querySelector("#inputTitle").value;
//       const taskDesc = document.querySelector("#inputDesc").value;

//       const div = document.createElement("div");

//       div.classList.add("task");
//       div.setAttribute("draggable", "true");

//       div.innerHTML = `
//                     <h4>${taskTitle}</h4>
//                     <p>${taskDesc}</p>
//                     <button>Delete</button>
//                 `;
//       column.appendChild(div);

//       div.addEventListener("drag", () => {
//         draggedElem = div;
//       });
//     });
//   }
// }

// const dragEvents = (column) => {
//   column.addEventListener("dragenter", (e) => {
//     e.preventDefault();
//     column.classList.add("on-hover");
//   });
//   column.addEventListener("dragleave", (e) => {
//     e.preventDefault();
//     column.classList.remove("on-hover");
//   });
//   column.addEventListener("dragover", (e) => {
//     e.preventDefault();
//   });
//   column.addEventListener("drop", (e) => {
//     e.preventDefault();

//     if (draggedElem) {
//       column.appendChild(draggedElem);
//       column.classList.remove("on-hover");
//     }

//     [todo, progress, done].forEach((col) => {
//       const tasks = col.querySelectorAll(".task");
//       const count = col.querySelector(".info span");

//       tasksData[col.id] = Array.from(tasks).map((t) => {
//         return {
//           title: t.querySelector("h4").innerText,
//           desc: t.querySelector("p").innerText,
//         };
//       });
//       localStorage.setItem("tasks", JSON.stringify(tasksData));
//       count.innerText = tasks.length;
//     });
//   });
// };

// dragEvents(todo);
// dragEvents(progress);
// dragEvents(done);

// addTask.addEventListener("click", () => {
//   modal.classList.toggle("active");
// });

// modalBg.addEventListener("click", () => {
//   modal.classList.toggle("active");
// });

// createTask.addEventListener("click", (e) => {
//     e.preventDefault()
//     console.log(e)
//   const taskTitle = document.querySelector("#inputTitle").value;
//   const taskDesc = document.querySelector("#inputDesc").value;

//   const div = document.createElement("div");
//   div.innerHTML = `<div draggable="true" class="task">
//                     <h4>${taskTitle}</h4>
//                     <p>${taskDesc}</p>
//                     <button>Delete</button>
//                 </div>
//                 `;

//     [todo, progress, done].forEach((col) => {
//       const tasks = col.querySelectorAll(".task");
//       const count = col.querySelector(".info span");

//       tasksData[col.id] = Array.from(tasks).map((t) => {
//         return {
//           title: t.querySelector("h4").innerText,
//           desc: t.querySelector("p").innerText,
//         };
//       });
//       localStorage.setItem("tasks", JSON.stringify(tasksData));
//       count.innerText = tasks.length;
//     });

//   div.addEventListener("drag", () => {
//     draggedElem = div;
//   });

//   todo.appendChild(div);
//   modal.classList.toggle("active");
// });



// ai code




const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const addTask = document.querySelector("#add-task");
const createTask = document.querySelector("#create-task");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".bg-modal");

let draggedElem = null;
const columns = [todo, progress, done];

// Helper: Save all columns to localStorage and update task counters
const updateStorageAndCounts = () => {
  const tasksData = {};

  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".info span");

    tasksData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h4").innerText,
      desc: t.querySelector("p").innerText,
    }));

    if (count) count.innerText = tasks.length;
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
};

// Helper: Build a task card with drag and delete events
const createTaskElement = (title, desc) => {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h4>${title}</h4>
    <p>${desc}</p>
    <button class="delete-btn">Delete</button>
  `;

  // Use dragstart instead of drag for better browser reliability
  div.addEventListener("dragstart", () => {
    draggedElem = div;
  });

  div.addEventListener("dragend", () => {
    draggedElem = null;
  });

  // Delete functionality
  div.querySelector(".delete-btn").addEventListener("click", () => {
    div.remove();
    updateStorageAndCounts();
  });

  return div;
};

// Load saved tasks on startup
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));
  for (const colId in data) {
    const column = document.querySelector(`#${colId}`);
    if (column) {
      data[colId].forEach((task) => {
        const taskEl = createTaskElement(task.title, task.desc);
        column.appendChild(taskEl);
      });
    }
  }
  updateStorageAndCounts();
}

// Setup Drag & Drop on columns
const setupDragEvents = (column) => {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("on-hover");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("on-hover");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("on-hover");
    if (draggedElem) {
      column.appendChild(draggedElem);
      updateStorageAndCounts();
    }
  });
};

columns.forEach(setupDragEvents);

// Modal controls
const toggleModal = () => modal.classList.toggle("active");
addTask.addEventListener("click", toggleModal);
modalBg.addEventListener("click", toggleModal);

// Create new task
createTask.addEventListener("click", () => {
  const titleInput = document.querySelector("#inputTitle");
  const descInput = document.querySelector("#inputDesc");

  if (!titleInput.value.trim()) return; // Prevent empty tasks

  const newTask = createTaskElement(titleInput.value, descInput.value);
  todo.appendChild(newTask);

  // Update storage AFTER appending
  updateStorageAndCounts();

  // Clear inputs and close modal
  titleInput.value = "";
  descInput.value = "";
  toggleModal();
});
