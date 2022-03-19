const todoForm = document.querySelector(".js-todo-form");
const todoList = document.querySelector(".todolist");
const now = new Date();
const formInput = todoForm.querySelectorAll(`.form__input`);
formInput[0].value = now.getFullYear();
formInput[1].value = now.getMonth();
formInput[2].value = now.getDay();
const todoInput = formInput[3];
const search = document.querySelector(".js-search");

// Load data from localstorage
const todoListData = JSON.parse(localStorage.getItem("todoListData")) || [];
// Use loaded data to create todo item
todoListData.forEach((todoData) => createTodoItem(todoData));

// Handle add todo form submit
function addTodo(e) {
  e.preventDefault();
  const todoData = Object.fromEntries(new FormData(e.target).entries());
  todoData.id = !todoListData.length
    ? 1
    : +todoListData[todoListData.length - 1].id + 1;
  todoData.isCompleted = false;

  if (!todo) {
    return;
  }

  const todoItem = createTodoItem(todoData);
  // Add to data
  todoListData.push(todoData);
  localStorage.setItem("todoListData", JSON.stringify(todoListData));

  todoInput.value = "";
}
todoForm.addEventListener("submit", addTodo);

// Create todo html element
function createTodoItem(todoData) {
  const { id, isCompleted, year, month, day, todo } = todoData;
  console.log(id, todoData);

  // Create todo item
  const todoItem = document.createElement("li");
  todoItem.classList.add("todo");
  if (isCompleted) {
    todoItem.classList.add("todo--complete");
  }
  todoItem.setAttribute("data-id", id);
  todoItem.innerHTML = `
    <p class="todo__title">${todo}</p>
    <div class="todo__wrap">
      <span class="todo__time">${year}/${month}/${day}</span>
      <button
        class="button todo__button todo__button--complete js-complete"
        aria-label="Complete todo"
      >
        <i class="fa-solid fa-check"></i>
      </button>
      <button
        class="button todo__button todo__button--delete js-delete"
        aria-label="Delete todo"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;

  // Create todo buttons after todo html element been created
  createCompleteTodoBtn(todoItem);
  createDeleteTodoBtn(todoItem);

  todoList.appendChild(todoItem);
  return todoItem;
}

// Create complete todo button
function createCompleteTodoBtn(todoItem) {
  const completeBtn = todoItem.querySelector(".js-complete");

  // Handle completing todo
  function completeTodo(e) {
    todoItem.classList.toggle("todo--complete");
    todoListData.forEach((todoData) => {
      if (todoData.id === +todoItem.dataset.id) {
        todoData.isCompleted = !todoData.isCompleted;
        localStorage.setItem("todoListData", JSON.stringify(todoListData));
        return;
      }
    });
  }
  completeBtn.addEventListener("click", completeTodo);
}

// Create delete todo button
function createDeleteTodoBtn(todoItem) {
  const deleteBtn = todoItem.querySelector(".js-delete");

  // Handle deleting todo
  function deleteTodo(e) {
    todoItem.addEventListener("animationend", () => {
      const targetIndex = todoListData.findIndex((todoData) => {
        return todoData.id === +todoItem.dataset.id;
      });
      todoListData.splice(targetIndex, 1);
      localStorage.setItem("todoListData", JSON.stringify(todoListData));
      todoItem.remove();
    });
    todoItem.classList.add("todo--delete");
  }
  deleteBtn.addEventListener("click", deleteTodo);
}

// Handle todo search
function handleTodoSearch(e) {
  const result = findMatches(e.target.value).map((todo) => todo.id);
  todoList.childNodes.forEach((todo) => {
    if (result.includes(+todo.dataset.id)) {
      todo.style.display = "";
    } else {
      todo.style.display = "none";
    }
  });
}

function findMatches(input) {
  return todoListData.filter((todoData) => {
    const regex = new RegExp(input, "gi");
    return regex.test(todoData.todo);
  });
}

search.addEventListener("input", handleTodoSearch);

function sortByTime() {
  // TODO: Sort todo list by time
}

function sortByName() {
  // TODO: Sort todo list by name
}
