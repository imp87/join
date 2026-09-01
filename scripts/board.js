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
    let bodyRef = document.getElementById("body");
    bodyRef.classList.add("hidden");
}

/**
 * Closes the submenu.
 *
 * @returns {void}
 */
function submenuClose() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.close();
    let bodyRef = document.getElementById("body");
    bodyRef.classList.remove("hidden");
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
 * Closes the task dialog and reloads the board.
 *
 * @returns {void}
 */
function taskClose() {
    let dialogRef = document.getElementById("task");
    dialogRef.close();
    selectedEditContacts = [];
    updateHTML();
    document.getElementById("body").classList.remove("hidden");
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
 * Opens a task and displays its details.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function taskOpen(id) {
    let dialogRef = document.getElementById("task");
    dialogRef.showModal();
    dialogRef.innerHTML = "";
    let priority = data[id].priority;
    let priorityFirstLetter = priority.charAt(0).toUpperCase() + priority.slice(1);
    dialogRef.innerHTML = getOpenTaskTemplate(id);
    taskOpenContactList(id);
    taskOpenSubtasks(id);
    taskOpenPriority(id, priority, priorityFirstLetter);
    taskOpenAssignedTo(id);
    taskOpenSubtasksDisplay(id);
    document.getElementById("body").classList.add("hidden");
}

/**
 * Displays the priority of an open task.
 *
 * @param {string} id - The item ID.
 * @param {string} priority - The priority.
 * @param {string} priorityFirstLetter - The priority first letter.
 *
 * @returns {void}
 */
function taskOpenPriority(id, priority, priorityFirstLetter) {
    if (data[id].priority === "") {
        document.getElementById(`task-open-priority'${id}'`).classList.add("display-none");
        document.getElementById(`open-task-priority-div'${id}'`).innerHTML = "";
    } else if (data[id].priority === `urgent` || data[id].priority === `medium` || data[id].priority === `low`) {
        document.getElementById(`task-open-priority'${id}'`).classList.remove("display-none");
        document.getElementById(`open-task-priority-div'${id}'`).innerHTML = `${priorityFirstLetter}<img src="./assets/img/${priority}.svg" alt="medium" />`
    }
}

/**
 * Hides the assigned contacts section when it is empty.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function taskOpenAssignedTo(id) {
    if (data[id].contacts === "") {
        document.getElementById(`task-assigned-to'${id}'`).classList.add("display-none");
    }
}

/**
 * Hides the subtask section when it is empty.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function taskOpenSubtasksDisplay(id) {
    if (!data[id].subtasks || data[id].subtasks.length === 0) {
        document.getElementById(`task-subtasks'${id}'`).classList.add("display-none");
    }
}

/**
 * Deletes the task.
 *
 * @param {string} id - The item ID.
 *
 * @returns {Promise<void>}
 */
async function deleteTask(id) {
    await fetch(
        `https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`,
        {
            method: "DELETE"
        }
    );

    updateHTML();
    taskClose();
}

/**
 * Displays the contacts assigned to a task.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function taskOpenContactList(id) {
    let taskOpenContactListRef = document.getElementById("task-card-open-contact-list");
    taskOpenContactListRef.innerHTML = "";
    let contacts = data[id].contacts;
    if (!contacts || contacts.length === 0) { return; }
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        taskOpenContactListRef.innerHTML += `
            <div class="person">
                <div style="background-color: ${contact.color};">${contact.initials}</div>
                <span>${contact.name}</span>
            </div>`;
    }
}

/**
 * Displays the subtasks of an open task.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function taskOpenSubtasks(id) {
    let taskOpenSubtasksRef = document.getElementById("task-open-subtasks");
    taskOpenSubtasksRef.innerHTML = "";
    let subtasks = data[id].subtasks;

    if (!subtasks || subtasks.length === 0) {
        return;
    }

    for (let index = 0; index < subtasks.length; index++) {
        taskOpenSubtasksRef.innerHTML += getOpenTaskSubtaskTemplate(id, index, subtasks);
    }
}

/**
 * Saves the completed state of a subtask.
 *
 * @param {string} taskId - The task ID.
 * @param {number} subtaskIndex - The subtask index.
 *
 * @returns {Promise<void>}
 */
async function updateSubtaskProgress(taskId, subtaskIndex) {
    let checkbox = document.getElementById(`subtask${subtaskIndex}`);
    data[taskId].subtasks[subtaskIndex].done = checkbox.checked;
    await fetch(
        `https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`,
        {
            method: "PATCH",
            body: JSON.stringify({
                subtasks: data[taskId].subtasks
            })
        }
    );
    updateHTML();
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
