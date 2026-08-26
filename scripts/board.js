let currentDraggedElement;
let data = [];
let selectedEditContacts = [];

function submenuOpen() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.showModal();
}

function submenuClose() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.close();
}

function logDownWBubblingProtection(event) {
    event.stopPropagation();
}

function addtaskOpen() {
    let dialogRef = document.getElementById("add-task");
    dialogRef.showModal();
}

function addTaskClose() {
    let dialogRef = document.getElementById("add-task");
    dialogRef.close();
}

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

function renderAllTasksByStatus() {
    renderTasksByStatus("To do", "to-do");
    renderTasksByStatus("In progress", "in-progress");
    renderTasksByStatus("Await feedback", "await-feedback");
    renderTasksByStatus("Done", "done");
}

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

function getTaskElements(filteredTasks, index) {
    subtasksProgressBar(filteredTasks, index);
    taskCardContacts(filteredTasks, index);
    taskCardPriority(filteredTasks, index);
    taskCardUserPrio(filteredTasks, index);
    taskCardDescription(filteredTasks, index);
}

function taskClose() {
    let dialogRef = document.getElementById("task");
    dialogRef.close();
    selectedEditContacts = [];
    updateHTML();
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(status) {
    await fetch(`https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks/${currentDraggedElement}.json`, {
        method: "PATCH",
        body: JSON.stringify({
            status: status
        })
    });

    updateHTML();
}

function taskCardDescription(filteredTasks, index) {
    if (document.getElementById(`description-${filteredTasks[index].id}`).innerHTML === "") {
        document.getElementById(`description-${filteredTasks[index].id}`).classList.add("display-none");
    }
}

function taskCardUserPrio(filteredTasks, index) {
    if (
        document.getElementById(`task-card-priority-${filteredTasks[index].id}`).innerHTML === "" &&
        document.getElementById(`task-card-contacts-${filteredTasks[index].id}`).innerHTML === ""
    ) {
        document.getElementById(`user-prio-${filteredTasks[index].id}`).classList.add("display-none");
    }
}

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

function progressBarNone(progressBar) {
    progressBar.innerHTML = "";
    progressBar.classList.add("display-none");
    return;
}

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

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight')
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight')
}

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
}

function taskOpenPriority(id, priority, priorityFirstLetter) {
    if (data[id].priority === "") {
        document.getElementById(`task-open-priority'${id}'`).classList.add("display-none");
        document.getElementById(`open-task-priority-div'${id}'`).innerHTML = "";
    } else if (data[id].priority === `urgent` || data[id].priority === `medium` || data[id].priority === `low`) {
        document.getElementById(`task-open-priority'${id}'`).classList.remove("display-none");
        document.getElementById(`open-task-priority-div'${id}'`).innerHTML = `${priorityFirstLetter}<img src="./assets/img/${priority}.svg" alt="medium" />`
    }
}

function taskOpenAssignedTo(id) {
    if (data[id].contacts === "") {
        document.getElementById(`task-assigned-to'${id}'`).classList.add("display-none");
    }
}

function taskOpenSubtasksDisplay(id) {
    if (!data[id].subtasks || data[id].subtasks.length === 0) {
        document.getElementById(`task-subtasks'${id}'`).classList.add("display-none");
    }
}

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
    for (let i = 0; i < contacts.length; i++) {
        let checkbox = document.getElementById(`edit-contact${i}`);
        if (checkbox && checkbox.checked) {
            selectedEditContacts.push(changedTaskSelectedContacts(i));
        }
    }
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

function searchTasks() {
    let searchValue = document.getElementById("search-bar").value.toLowerCase();
    let filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue) ||
        task.category.toLowerCase().includes(searchValue)
    );

    renderSearchResults(filteredTasks);
}

function renderSearchResults(filteredTasks) {
    renderTasksByStatus("To do", "to-do", filteredTasks);
    renderTasksByStatus("In progress", "in-progress", filteredTasks);
    renderTasksByStatus("Await feedback", "await-feedback", filteredTasks);
    renderTasksByStatus("Done", "done", filteredTasks);
}
