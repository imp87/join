let currentTaskIndex;
let currentEditTaskId;

function editTask(id) {
    currentEditTaskId = id;
    let task = tasks.find(task => task.id === id);
    currentTaskIndex = tasks.findIndex(task => task.id === id);
    if (!task) return;
    renderEditTask(task, id);
}

function renderEditTask(task, id) {
    let taskRef = document.getElementById("task-content");
    taskRef.innerHTML = "";
    taskRef.innerHTML = getEditTaskTemplate(id, task);
    generateEditContacts(task);
    generateEditSubtasks(task);
}

function editClearSubtask() {
    document.getElementById("edit-subtask").value = "";
}

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

function editEditSubtasks(iSubtask) {
    let task = tasks.find(task => task.id === currentEditTaskId);
    let subtaskRef = document.getElementById(`subtask-${iSubtask}`);
    subtaskRef.innerHTML = getEditTaskEditSubtaskTemplate(iSubtask, task);;
}

function saveEditedSubtask(iSubtask) {
    let task = tasks.find(task => task.id === currentEditTaskId);
    let input = document.getElementById(`edit-edit-subtask-${iSubtask}`);
    let newValue = input.value.trim();
    if (newValue === "") return;
    task.subtasks[iSubtask].text = newValue;

    generateEditSubtasks(task);
}

function editDeleteSubtask(iSubtask) {
    let task = tasks.find(task => task.id === currentEditTaskId);
    task.subtasks.splice(iSubtask, 1);

    generateEditSubtasks(task);
}

function toggleEditContactList() {
    document.getElementById("edit-contact-list").classList.toggle("display-none");
}

function generateEditContacts(task) {
    let renderedContacts = 0;
    let contactLine = document.getElementById("edit-contact-line");
    contactLine.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let isChecked = task.contacts?.some(taskContact => taskContact.name === contact.name && taskContact.initials === contact.initials && taskContact.color === contact.color);
        document.getElementById("edit-contact-list").innerHTML += getEditTaskContactTemplate(i, isChecked, contact);
        if (isChecked && renderedContacts < 3) {
            contactLine.innerHTML += `<div class="initials" style="background-color: ${contact.color}">${contact.initials}</div>`;
            renderedContacts++;
        } if (isChecked) {
            selectedEditContacts.push(contact);
        }
    }
}

function editContactLine(contactLine, contact, renderedContacts) {
    contactLine.innerHTML += `<div class="initials" style="background-color: ${contact.color}">${contact.initials}</div>`;
    renderedContacts++;
}

function updateEditContactLine() {
    let contactLine = document.getElementById("edit-contact-line");
    contactLine.innerHTML = "";
    let renderedContacts = 0;
    for (let i = 0; i < contacts.length; i++) {
        let checkbox = document.getElementById(`edit-contact${i}`);
        if (checkbox && checkbox.checked && renderedContacts < 3) {
            let contact = contacts[i];
            contactLine.innerHTML += `<div class="initials" style="background-color: ${contact.color}">${contact.initials}</div>`;
            renderedContacts++;
        }
    }
}

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

function editTaskChangedErrorsRemove(titleError, titleInput, dateError) {
    titleError.innerHTML = "";
    dateError.innerHTML = "";
    titleInput.classList.remove("input-error");
    document.getElementById("edit-date-input").classList.remove("input-error");
}

function getTitleError(titleError, titleInput, hasError) {
    titleError.innerHTML = "*This field is required";
    titleInput.classList.add("input-error");
    hasError = true;
}

function getDateTerror(dateError, hasError) {
    dateError.innerHTML = "*This field is required";
    document.getElementById("edit-date-input").classList.add("input-error");
    hasError = true;
}

async function changedTask(title, description, date, id) {
    let priority = document.querySelector('input[name="edit-priority"]:checked')?.value || "";
    await fetchChangedTask(title, description, date, priority, id);
}

function changedTaskSelectedContacts(i) {
    return {
        name: contacts[i].name,
        initials: contacts[i].initials,
        color: contacts[i].color
    }
}

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