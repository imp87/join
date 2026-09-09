let subtasks = []
let tasks = []

let resizing = false;
let textarea;
let startY;
let startHeight;

/**
 * Starts resizing a text area.
 *
 * @param {Event} event - The browser event.
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function startResize(event, id) {
    event.preventDefault();

    resizing = true;
    textarea = document.getElementById(id);

    startY = event.clientY;
    startHeight = textarea.offsetHeight;

    document.addEventListener("mousemove", resizeTextarea);
    document.addEventListener("mouseup", stopResize);
}

/**
 * Resizes the active text area while the pointer moves.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {void}
 */
function resizeTextarea(event) {
    if (!resizing) return;

    let heightChange = event.clientY - startY;
    let newHeight = startHeight + heightChange;

    newHeight = Math.max(120, Math.min(newHeight, 180));

    textarea.style.height = `${newHeight}px`;
}

/**
 * Stops resizing the text area.
 *
 * @returns {void}
 */
function stopResize() {
    resizing = false;

    document.removeEventListener("mousemove", resizeTextarea);
    document.removeEventListener("mouseup", stopResize);
}

/**
 * Keeps a text area between its minimum and maximum height.
 *
 * @param {HTMLElement} textarea - The text area element.
 *
 * @returns {void}
 */
function limitTextarea(textarea) {
    const maxHeight = 180;
    const minHeight = 120;

    textarea.style.height = `${minHeight}px`;

    if (textarea.scrollHeight > maxHeight) {
        textarea.value = textarea.value.slice(0, -1);
        textarea.style.height = `${maxHeight}px`;
        return;
    }

    textarea.style.height = `${textarea.scrollHeight}px`;
}

/**
 * Toggles the category options.
 *
 * @returns {void}
 */
function toggleCategoryOptions() {
    document.getElementById("category-options").classList.toggle("display-none");
    document.getElementById("category-arrow").classList.toggle("upside");
}

/**
 * Closes the category options.
 *
 * @returns {void}
 */
function closeCategoryOptions() {
    document.getElementById("category-options").classList.add("display-none");
    document.getElementById("category-arrow").classList.remove("upside");
}

/**
 * Selects the category.
 *
 * @param {string} category - The category.
 *
 * @returns {void}
 */
function selectCategory(category) {
    document.getElementById("category-input").value = category;

    toggleCategoryOptions();
}

/**
 * Validates and saves the task form.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {Promise<void>}
 */
async function addToTasks(event) {
    event.preventDefault();
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let date = document.getElementById("due-date");
    let priority = document.querySelector('input[name="priority"]:checked')?.value || "";
    let category = document.getElementById("category-input");
    let validationMessage = document.querySelectorAll(".validation-message");

    if (category.value === "" || title.value === "" || date.value === "") {
        return errorMessage(validationMessage, title);
    }
    messageTaskSuccess(validationMessage, title, description, date, priority, category, subtasks);
}

/**
 * Continues after the task form was validated successfully.
 *
 * @param {NodeListOf<HTMLElement>} validationMessage - The validation message elements.
 * @param {HTMLInputElement} title - The title.
 * @param {HTMLInputElement} description - The description.
 * @param {HTMLInputElement} date - The date.
 * @param {string} priority - The priority.
 * @param {HTMLInputElement} category - The category.
 * @param {Array<Object>} subtasks - The subtasks.
 *
 * @returns {void}
 */
function messageTaskSuccess(validationMessage, title, description, date, priority, category, subtasks) {
    removeErrorMessage(validationMessage, title, date);
    getTaskValue(title, description, date, priority, category, subtasks);
    showSuccessDialog();
}

/**
 * Shows the required-field errors in the task form.
 *
 * @param {NodeListOf<HTMLElement>} validationMessage - The validation message elements.
 * @param {HTMLInputElement} title - The title.
 *
 * @returns {void}
 */
function errorMessage(validationMessage, title) {
    document.getElementById("custom-category-input").classList.add("input-error");
    validationMessage.forEach(element => { element.innerHTML = "This field is required" });
    title.classList.add("input-error");
    document.getElementById("date-input").classList.add("input-error");
    return;
}

/**
 * Removes the required-field errors from the task form.
 *
 * @param {NodeListOf<HTMLElement>} validationMessage - The validation message elements.
 * @param {HTMLInputElement} title - The title.
 * @param {HTMLInputElement} date - The date.
 *
 * @returns {void}
 */
function removeErrorMessage(validationMessage, title, date) {
    document.getElementById("custom-category-input").classList.remove("input-error");
    validationMessage.forEach(element => { element.innerHTML = "" });
    title.classList.remove("input-error");
    document.getElementById("date-input").classList.remove("input-error");
}

/**
 * Builds a task from the form values and saves it.
 *
 * @param {HTMLInputElement} title - The title.
 * @param {HTMLInputElement} description - The description.
 * @param {HTMLInputElement} date - The date.
 * @param {string} priority - The priority.
 * @param {HTMLInputElement} category - The category.
 * @param {Array<Object>} subtasks - The subtasks.
 *
 * @returns {Promise<void>}
 */
async function getTaskValue(title, description, date, priority, category, subtasks) {
    let task = {
        "title": title.value,
        "description": description.value,
        "date": date.value,
        "priority": priority,
        "contacts": selectedContacts.length > 0 ? selectedContacts : "",
        "category": category.value,
        "subtasks": subtasks.length > 0 ? subtasks : "",
        "status": "To do"
    };
    postToDatabase(task)
}

/**
 * Saves a task in the database.
 *
 * @param {Object} task - The task data.
 *
 * @returns {Promise<void>}
 */
async function postToDatabase(task) {
    let response = await fetch(
        "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks.json",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        }
    );
    let result = await response.json();
}

/**
 * Clears the subtask.
 *
 * @returns {void}
 */
function clearSubtask() {
    let subtaskInput = document.getElementById("subtask");
    subtaskInput.value = "";
}

/**
 * Adds the subtask.
 *
 * @returns {void}
 */
function addSubtask() {
    let subtaskInput = document.getElementById("subtask");

    if (subtaskInput.value.length >= 3) {
        subtasks.push({
            text: subtaskInput.value,
            done: false
        });
        subtaskInput.value = "";
        renderSubtasks()
    }
}

/**
 * Deletes the subtask.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {void}
 */
function deleteSubtask(iSubtask) {
    subtasks.splice(iSubtask, 1);

    renderSubtasks()
}

/**
 * Renders the subtasks.
 *
 * @returns {void}
 */
function renderSubtasks() {
    let subtaskInteraction = document.getElementById("subtask-interaction");
    subtaskInteraction.innerHTML = "";

    for (let iSubtask = 0; iSubtask < subtasks.length; iSubtask++) {
        subtaskInteraction.innerHTML += getSubtaskTemplate(iSubtask);
    }
}

/**
 * Opens a subtask for editing.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {void}
 */
function editSubtasks(iSubtask) {
    let subtaskRef = document.getElementById(`subtask-${iSubtask}`)

    subtaskRef.innerHTML = getEditSubtaskTemplate(iSubtask);
}

/**
 * Saves the edited subtask text.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {void}
 */
function subtaskEdited(iSubtask) {
    let editSubtaskInput = document.getElementById(`edit-subtask-${iSubtask}`)
    subtasks[iSubtask].text = editSubtaskInput.value;

    renderSubtasks()
}

/**
 * Clears the task form.
 *
 * @returns {void}
 */
function clearTaskForm() {
    let form = document.getElementById("task-form");
    form.reset();

    document.getElementById("category-input").value = "";
    document.querySelectorAll('input[name="assign-contact"]:checked').forEach(checkbox => { checkbox.checked = false; });
    document.getElementById("contact-line").innerHTML = "";
    document.getElementById("subtask-interaction").innerHTML = "";
    subtasks = [];
}

/**
 * Shows the success dialog.
 *
 * @returns {void}
 */
function showSuccessDialog() {
    let dialog = document.getElementById("success-dialog");

    dialog.showModal();

    setTimeout(() => {
        dialog.close();
        window.location.href = "./board.html";
    }, 2000);
}

/**
 * Sets today's date as the earliest due date.
 *
 * @returns {void}
 */
function setMinDate() {
    let dateInput = document.getElementById("due-date");

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}

/**
 * Sets today's date as the earliest date in the edit form.
 *
 * @returns {void}
 */
function setMinEditDate() {
    let dateInput = document.getElementById("edit-date");

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}

/**
 * Searches for the contacts.
 *
 * @returns {void}
 */
function searchContacts() {
    let searchValue = document.getElementById("contacts").value.toLowerCase();
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.remove("display-none");

    let filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    contactListRef.innerHTML = "";

    for (let iContact = 0; iContact < filteredContacts.length; iContact++) {
        contactListRef.innerHTML += getFilteredTaskContactTemplate(filteredContacts, iContact);
    }
}


