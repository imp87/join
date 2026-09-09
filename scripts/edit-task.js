let currentTaskIndex;
let currentEditTaskId;

/**
 * Edits the task.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function editTask(id) {
    currentEditTaskId = id;
    let task = tasks.find(task => task.id === id);
    currentTaskIndex = tasks.findIndex(task => task.id === id);
    if (!task) return;
    renderEditTask(task, id);
}

/**
 * Renders the form for editing a task.
 *
 * @param {Object} task - The task data.
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function renderEditTask(task, id) {
    let taskRef = document.getElementById("task-content");
    taskRef.innerHTML = "";
    taskRef.innerHTML = getEditTaskTemplate(id, task);
    generateEditContacts(task);
    generateEditSubtasks(task);
}

/**
 * Clears the new-subtask input in the edit form.
 *
 * @returns {void}
 */
function editClearSubtask() {
    document.getElementById("edit-subtask").value = "";
}

/**
 * Adds a subtask in the edit form.
 *
 * @returns {void}
 */
function editAddSubtask() {
    let input = document.getElementById("edit-subtask");
    let value = input.value.trim();
    if (value === "") { return; }
    let task = tasks.find(task => task.id === currentEditTaskId);
    if (!task) { return; }
    if (!task.subtasks) { task.subtasks = []; }
    task.subtasks.push({
        text: value,
        done: false
    });
    input.value = "";
    generateEditSubtasks(task);
}

/**
 * Renders the subtasks in the edit form.
 *
 * @param {Object} task - The task data.
 *
 * @returns {void}
 */
function generateEditSubtasks(task) {
    let subtaskRef = document.getElementById("edit-subtask-interaction");
    subtaskRef.innerHTML = "";

    if (!task.subtasks || task.subtasks.length === 0) {
        return;
    }

    for (let iSubtask = 0; iSubtask < task.subtasks.length; iSubtask++) {
        subtaskRef.innerHTML += getEditTaskSubtaskTemplate(iSubtask, task);
    }
}

/**
 * Opens a subtask for editing.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {void}
 */
function editEditSubtasks(iSubtask) {
    let task = tasks.find(task => task.id === currentEditTaskId);
    let subtaskRef = document.getElementById(`subtask-${iSubtask}`);
    subtaskRef.innerHTML = getEditTaskEditSubtaskTemplate(iSubtask, task);;
}

/**
 * Saves the edited subtask.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {void}
 */
function saveEditedSubtask(iSubtask) {
    let task = tasks.find(task => task.id === currentEditTaskId);
    let input = document.getElementById(`edit-edit-subtask-${iSubtask}`);
    let newValue = input.value.trim();
    if (newValue === "") return;
    task.subtasks[iSubtask].text = newValue;

    generateEditSubtasks(task);
}

/**
 * Deletes a subtask from the edited task.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {void}
 */
function editDeleteSubtask(iSubtask) {
    let task = tasks.find(task => task.id === currentEditTaskId);
    task.subtasks.splice(iSubtask, 1);

    generateEditSubtasks(task);
}

/**
 * Reads and validates the edited task form.
 *
 * @param {Event} event - The browser event.
 * @param {string} id - The item ID.
 *
 * @returns {Promise<void>}
 */
async function editTaskChanged(event, id) {
    event.preventDefault();
    let titleInput = document.getElementById("edit-title");
    let dateInput = document.getElementById("edit-date");
    let title = titleInput.value.trim();
    let description = document.getElementById("edit-description").value.trim();
    let date = dateInput.value;
    let titleError = document.getElementById("edit-title-error");
    let dateError = document.getElementById("edit-date-error");

    await allEditTaskChangedFunctions(titleInput, title, description, date, titleError, dateError, id);
    selectedEditContacts = [];
}

/**
 * Validates and saves the edited task.
 *
 * @param {HTMLElement} titleInput - The title input.
 * @param {string} title - The title.
 * @param {string} description - The description.
 * @param {string} date - The date.
 * @param {HTMLElement} titleError - The title error.
 * @param {HTMLElement} dateError - The date error.
 * @param {string} id - The item ID.
 *
 * @returns {Promise<void>}
 */
async function allEditTaskChangedFunctions(titleInput, title, description, date, titleError, dateError, id) {
    editTaskChangedErrorsRemove(titleError, titleInput, dateError);
    let hasError = false;
    if (title === "") { return getTitleError(titleError, titleInput, hasError); }
    if (date === "") { return getDateTerror(dateError, hasError); }
    if (hasError) { return; }
    await changedTask(title, description, date, id)
    await updateHTML();
    taskOpen(id)
}

/**
 * Clears validation errors from the edit form.
 *
 * @param {HTMLElement} titleError - The title error.
 * @param {HTMLElement} titleInput - The title input.
 * @param {HTMLElement} dateError - The date error.
 *
 * @returns {void}
 */
function editTaskChangedErrorsRemove(titleError, titleInput, dateError) {
    titleError.innerHTML = "";
    dateError.innerHTML = "";
    titleInput.classList.remove("input-error");
    document.getElementById("edit-date-input").classList.remove("input-error");
}

/**
 * Shows the error for an empty task title.
 *
 * @param {HTMLElement} titleError - The title error.
 * @param {HTMLElement} titleInput - The title input.
 * @param {boolean} hasError - Whether validation found an error.
 *
 * @returns {void}
 */
function getTitleError(titleError, titleInput, hasError) {
    titleError.innerHTML = "*This field is required";
    titleInput.classList.add("input-error");
    hasError = true;
}

/**
 * Shows the error for an empty task date.
 *
 * @param {HTMLElement} dateError - The date error.
 * @param {boolean} hasError - Whether validation found an error.
 *
 * @returns {void}
 */
function getDateTerror(dateError, hasError) {
    dateError.innerHTML = "*This field is required";
    document.getElementById("edit-date-input").classList.add("input-error");
    hasError = true;
}

/**
 * Collects and saves all changed task values.
 *
 * @param {string} title - The title.
 * @param {string} description - The description.
 * @param {string} date - The date.
 * @param {string} id - The item ID.
 *
 * @returns {Promise<void>}
 */
async function changedTask(title, description, date, id) {
    let priority = document.querySelector('input[name="edit-priority"]:checked')?.value || "";
    await fetchChangedTask(title, description, date, priority, id);
}

/**
 * Creates a small contact object for an edited task.
 *
 * @param {number} i - The item index.
 *
 * @returns {Object} The selected contact data.
 */
function changedTaskSelectedContacts(i) {
    return {
        name: contacts[i].name,
        initials: contacts[i].initials,
        color: contacts[i].color
    }
}

/**
 * Saves the changed task in the database.
 *
 * @param {string} title - The title.
 * @param {string} description - The description.
 * @param {string} date - The date.
 * @param {string} priority - The priority.
 * @param {string} id - The item ID.
 *
 * @returns {Promise<void>}
 */
async function fetchChangedTask(title, description, date, priority, id) {
    let task = tasks.find(task => task.id === currentEditTaskId);
    if (!task) return;
    let changedTask = changedTaskData(title, description, date, priority, task);

    await fetch(`https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks/${currentEditTaskId}.json`, {
        method: "PATCH",
        body: JSON.stringify(changedTask)
    });

    updateTask(task, title, description, date, priority, id);
}

/**
 * Creates the data object for an edited task.
 *
 * @param {string} title - The title.
 * @param {string} description - The description.
 * @param {string} date - The date.
 * @param {string} priority - The priority.
 * @param {Object} task - The task data.
 *
 * @returns {Object} The changed task data.
 */
function changedTaskData(title, description, date, priority, task) {
    return {
        "title": title,
        "description": description,
        "date": date,
        "priority": priority,
        "contacts": selectedEditContacts,
        "subtasks": task.subtasks || []
    }
}

/**
 * Updates the task.
 *
 * @param {Object} task - The task data.
 * @param {string} title - The title.
 * @param {string} description - The description.
 * @param {string} date - The date.
 * @param {string} priority - The priority.
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function updateTask(task, title, description, date, priority, id) {
    task.title = title;
    task.description = description;
    task.date = date;
    task.priority = priority;
    task.contacts = selectedEditContacts;

    data[id].title = title;
    data[id].description = description;
    data[id].date = date;
    data[id].priority = priority;
    data[id].contacts = selectedEditContacts;
    data[id].subtasks = task.subtasks || [];
}

/**
 * Searches contacts in the edit form.
 *
 * @returns {void}
 */
function searchEditContacts() {
    let searchValue = document.getElementById("edit-contacts").value.toLowerCase();
    let contactListRef = document.getElementById("edit-contact-list");
    contactListRef.classList.remove("display-none");
    let filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    contactListRef.innerHTML = "";

    for (let iContact = 0; iContact < filteredContacts.length; iContact++) {
        contactListRef.innerHTML += getFilteredEditTaskContactTemplate(filteredContacts, iContact);
    }
}

/**
 * Adds or removes a contact from the edited task.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function getSelectedEditContacts(id) {
    let index = contacts.findIndex(item => item.id === id);
    if (index === -1) return;

    selectedEditContactsPush(id, index)
    updateSelectedEditContacts()
}

/**
 * Updates the selected contacts of the edited task.
 *
 * @param {string} id - The item ID.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function selectedEditContactsPush(id, index) {
    let contact = contacts[index];
    let selectedIndex = selectedEditContacts.findIndex(item => item.id === id);
    if (selectedIndex === -1) {
        selectedEditContacts.push({
            name: contact.name,
            initials: contact.initials,
            color: contact.color,
            id: contact.id
        });
    } else {
        selectedEditContacts.splice(selectedIndex, 1);
    }
}

/**
 * Displays the selected contacts in the edit form.
 *
 * @returns {void}
 */
function updateSelectedEditContacts() {
    let contactLine = document.getElementById("edit-contact-line");
    contactLine.innerHTML = "";

    for (
        let contactIndex = 0;
        contactIndex < selectedEditContacts.length;
        contactIndex++
    ) {
        contactLine.innerHTML += `
        <div class="initials" style="background-color: ${selectedEditContacts[contactIndex].color}">${selectedEditContacts[contactIndex].initials}</div>
        `;
    }
}