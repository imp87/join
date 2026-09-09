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