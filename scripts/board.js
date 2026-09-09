let currentDraggedElement;
let data = [];
let selectedEditContacts = [];

/**
 * Opens the submenu.
 *
 * @returns {void}
 */
function submenuOpen() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.showModal();
}

/**
 * Closes the submenu.
 *
 * @returns {void}
 */
function submenuClose() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.close();
}

/**
 * Stops the event from bubbling to parent elements.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {void}
 */
function logDownWBubblingProtection(event) {
    event.stopPropagation();
}

/**
 * Opens the dialog for adding a task.
 *
 * @returns {void}
 */
function addtaskOpen() {
    let dialogRef = document.getElementById("add-task");
    dialogRef.showModal();
    let bodyRef = document.getElementById("body");
    bodyRef.classList.add("hidden");
}

/**
 * Closes the dialog for adding a task.
 *
 * @returns {void}
 */
function addTaskClose() {
    let dialogRef = document.getElementById("add-task");
    dialogRef.close();
    let bodyRef = document.getElementById("body");
    bodyRef.classList.remove("hidden");
}

/**
 * Loads all tasks and updates the board.
 *
 * @returns {Promise<void>}
 */
async function updateHTML() {
    let response = await fetch("https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks.json");
    data = await response.json();

    if (!data) {
        data = {};
        tasks = [];
        renderAllTasksByStatus();
        return;
    }

    tasks = Object.entries(data).map(([id, task]) => ({ id, ...task }));
    renderAllTasksByStatus();
}

/**
 * Renders all task columns.
 *
 * @returns {void}
 */
function renderAllTasksByStatus() {
    renderTasksByStatus("To do", "to-do");
    renderTasksByStatus("In progress", "in-progress");
    renderTasksByStatus("Await feedback", "await-feedback");
    renderTasksByStatus("Done", "done");
}

/**
 * Renders the tasks for one status.
 *
 * @param {string} status - The status.
 * @param {string} containerId - The container id.
 * @param {Array<Object>} taskList - The tasks to render.
 *
 * @returns {void}
 */
function renderTasksByStatus(status, containerId, taskList = tasks) {
    let filteredTasks = taskList.filter(task => task.status === status);
    let container = document.getElementById(containerId);
    container.innerHTML = "";

    if (filteredTasks.length === 0) {
        container.innerHTML = `<div class="no-task">No tasks ${status}</div>`;
        return;
    }

    getFilteredTasks(filteredTasks, container);
}

/**
 * Renders all tasks from a filtered task list.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {HTMLElement} container - The target container.
 *
 * @returns {void}
 */
function getFilteredTasks(filteredTasks, container) {
    for (let index = 0; index < filteredTasks.length; index++) {
        let description = filteredTasks[index].description;
        description = description.length > 45
            ? description.slice(0, 45) + "..."
            : description;

        container.innerHTML += getFilteredTasksTemplate(filteredTasks, index, description);
        getTaskElements(filteredTasks, index);
    }
}

/**
 * Updates the extra elements of a task card.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function getTaskElements(filteredTasks, index) {
    subtasksProgressBar(filteredTasks, index);
    taskCardContacts(filteredTasks, index);
    taskCardPriority(filteredTasks, index);
    taskCardUserPrio(filteredTasks, index);
    taskCardDescription(filteredTasks, index);
}

/**
 * Stores the task that is being dragged.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Allows a task to be dropped in a column.
 *
 * @param {Event} ev - The drag event.
 *
 * @returns {void}
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves the dragged task to a new status.
 *
 * @param {string} status - The status.
 *
 * @returns {Promise<void>}
 */
async function moveTo(status) {
    await fetch(`https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks/${currentDraggedElement}.json`, {
        method: "PATCH",
        body: JSON.stringify({
            status: status
        })
    });

    updateHTML();
}

/**
 * Hides an empty task description.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function taskCardDescription(filteredTasks, index) {
    if (document.getElementById(`description-${filteredTasks[index].id}`).innerHTML === "") {
        document.getElementById(`description-${filteredTasks[index].id}`).classList.add("display-none");
    }
}

/**
 * Hides the contact and priority row when it is empty.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function taskCardUserPrio(filteredTasks, index) {
    if (
        document.getElementById(`task-card-priority-${filteredTasks[index].id}`).innerHTML === "" &&
        document.getElementById(`task-card-contacts-${filteredTasks[index].id}`).innerHTML === ""
    ) {
        document.getElementById(`user-prio-${filteredTasks[index].id}`).classList.add("display-none");
    }
}

/**
 * Displays the priority icon on a task card.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function taskCardPriority(filteredTasks, index) {
    if (filteredTasks[index].priority === "urgent") {
        document.getElementById(`task-card-priority-${filteredTasks[index].id}`).innerHTML = `
        <img src="./assets/img/urgent.svg" alt="urgent" />`;
    } else if (filteredTasks[index].priority === "medium") {
        document.getElementById(`task-card-priority-${filteredTasks[index].id}`).innerHTML = `
        <img src="./assets/img/medium.svg" alt="medium" />`;
    } else if (filteredTasks[index].priority === "low") {
        document.getElementById(`task-card-priority-${filteredTasks[index].id}`).innerHTML = `
        <img src="./assets/img/low.svg" alt="low" />`;
    } else {
        document.getElementById(`task-card-priority-${filteredTasks[index].id}`).innerHTML = "";
    }
}

/**
 * Updates the subtask progress bar of a task card.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function subtasksProgressBar(filteredTasks, index) {
    let task = filteredTasks[index];
    let progressBar = document.getElementById(`progress-bar-${task.id}`);
    if (!progressBar) return;
    let subtasks = task.subtasks;
    if (!subtasks || subtasks.length === 0) {
        return progressBarNone(progressBar);
    }

    let completed = subtasks.filter(subtask => subtask.done).length;
    let total = subtasks.length;
    progressBar.innerHTML = `<progress value="${completed}" max="${total}"></progress> <label>${completed}/${total} Subtasks</label>`;
    progressBar.classList.remove("display-none");
}

/**
 * Hides an unused subtask progress bar.
 *
 * @param {HTMLElement} progressBar - The progress bar element.
 *
 * @returns {void}
 */
function progressBarNone(progressBar) {
    progressBar.innerHTML = "";
    progressBar.classList.add("display-none");
    return;
}

/**
 * Displays up to three contacts on a task card.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function taskCardContacts(filteredTasks, index) {
    let contacts = filteredTasks[index].contacts;
    let taskCardContactsRef = document.getElementById(`task-card-contacts-${filteredTasks[index].id}`);
    if (!contacts || contacts.length === 0) {
        taskCardContactsRef.classList.add("display-none");
        return;
    }
    taskCardContactsRef.classList.remove("display-none");
    taskCardContactsRef.innerHTML = "";
    for (let contactIndex = 0; contactIndex < contacts.length && contactIndex < 3; contactIndex++) {
        taskCardContactsRef.innerHTML += `<div style="background-color: ${contacts[contactIndex].color};">${contacts[contactIndex].initials}</div>`;
    }
    if (contacts.length > 3) { taskCardContactsRef.innerHTML += `<div style="background-color: grey;">+${contacts.length - 3}</div>`; }
}

/**
 * Highlights a task column.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight')
}

/**
 * Removes the highlight from a task column.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight')
}



/**
 * Searches the tasks by text.
 *
 * @returns {void}
 */
function searchTasks() {
    let searchValue = document.getElementById("search-bar").value.toLowerCase();
    let filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue) ||
        task.category.toLowerCase().includes(searchValue)
    );

    renderSearchResults(filteredTasks);
}

/**
 * Renders the search results.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 *
 * @returns {void}
 */
function renderSearchResults(filteredTasks) {
    renderTasksByStatus("To do", "to-do", filteredTasks);
    renderTasksByStatus("In progress", "in-progress", filteredTasks);
    renderTasksByStatus("Await feedback", "await-feedback", filteredTasks);
    renderTasksByStatus("Done", "done", filteredTasks);
}

/**
 * Move Task
 * 
 * @param {*string} status 
 * @param {*string} id 
 */
function openMoveTo(status, id) {
    let moveToRef = document.getElementById(`move-to${id}`);
    moveToRef.classList.remove("no-display");
    moveToRef.innerHTML = `<h5>Move to</h5>`
    if (status === "To do") {
        moveToRef.innerHTML += `<button onclick="startDragging('${id}'); moveTo('In progress');"><img src="./assets/img/arrow_downward.svg" alt="arrow downward">Progress</button>`
    } else if (status === "In progress") {
        moveToRef.innerHTML += `<button onclick="startDragging('${id}'); moveTo('To do');"><img src="./assets/img/arrow_upward.svg" alt="arrow upward">To-do</button>
                                <button onclick="startDragging('${id}'); moveTo('Await feedback');"><img src="./assets/img/arrow_downward.svg" alt="arrow downward">Review</button>`
    } else if (status === "Await feedback") {
        moveToRef.innerHTML += `<button onclick="startDragging('${id}'); moveTo('In progress');"><img src="./assets/img/arrow_upward.svg" alt="arrow upward">Progress</button>
                                <button onclick="startDragging('${id}'); moveTo('Done');"><img src="./assets/img/arrow_downward.svg" alt="arrow downward">Done</button>`
    } else if (status === "Done") { moveToRef.innerHTML += `<button onclick="startDragging('${id}'); moveTo('Await feedback');"><img src="./assets/img/arrow_upward.svg" alt="arrow downward">Review</button>` }
}
