let currentDraggedElement;
let data = [];

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



function taskOpen(id) {
    let dialogRef = document.getElementById("task");
    dialogRef.showModal();
    dialogRef.innerHTML = "";
    let priority = data[id].priority;
    let priorityFirstLetter = priority.charAt(0).toUpperCase() + priority.slice(1);

    dialogRef.innerHTML = getOpenTaskTemplate(id, priorityFirstLetter, priority);
    taskOpenContactList(id);
    taskOpenSubtasks(id);
    taskOpenPriority(id);
    taskOpenAssignedTo(id);
    taskOpenSubtasksDisplay(id);

}

function taskOpenSubtasksDisplay(id) {
    if (!data[id].subtasks || data[id].subtasks.length === 0) {
        document.getElementById(`task-subtasks'${id}'`).classList.add("display-none");
    }
}


function taskOpenAssignedTo(id) {
    if (data[id].contacts === "") {
        document.getElementById(`task-assigned-to'${id}'`).classList.add("display-none");
    }
}

function taskOpenPriority(id) {
    if (data[id].priority === "") {
        document.getElementById(`task-open-priority'${id}'`).classList.add("display-none");
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

    for (let index = 0; index < data[id].contacts.length; index++) {
        let contactColor = getContactColor(data[id].contacts[index].firstname, data[id].contacts[index].lastname);
        taskOpenContactListRef.innerHTML += `<div class="person"><div style="background-color: ${contactColor};">${data[id].contacts[index].firstname[0]}${data[id].contacts[index].lastname[0]}</div><span>${data[id].contacts[index].firstname} ${data[id].contacts[index].lastname}</span></div>`;
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

function taskClose() {
    let dialogRef = document.getElementById("task");
    dialogRef.close();
    updateHTML();
}


async function updateHTML() {
    let response = await fetch(
        "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
    );

    data = await response.json();

    tasks = Object.entries(data).map(([id, task]) => {
        return { id: id, ...task };
    });


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
        progressBar.innerHTML = "";
        progressBar.classList.add("display-none");
        return;
    }

    let completed = subtasks.filter(subtask => subtask.done).length;
    let total = subtasks.length;

    progressBar.innerHTML = `
        <progress value="${completed}" max="${total}"></progress>
        <label>${completed}/${total} Subtasks</label>
    `;

    progressBar.classList.remove("display-none");
}


function taskCardContacts(filteredTasks, index) {
    if (filteredTasks[index].contacts != "") {
        let taskCardContactsRef = document.getElementById(`task-card-contacts-${filteredTasks[index].id}`);
        taskCardContactsRef.innerHTML = "";

        for (let contactIndex = 0; contactIndex < filteredTasks[index].contacts.length; contactIndex++) {
            let firstLetter = filteredTasks[index].contacts[contactIndex].firstname[0];
            let firstLetterLastName = filteredTasks[index].contacts[contactIndex].lastname[0];

            let contactColor = getContactColor(
                filteredTasks[index].contacts[contactIndex].firstname,
                filteredTasks[index].contacts[contactIndex].lastname
            );

            taskCardContactsRef.innerHTML += `
            <div style="background-color: ${contactColor};">
                ${firstLetter}${firstLetterLastName}
            </div>`;
        }
    } else {
        document.getElementById(`task-card-contacts-${filteredTasks[index].id}`).classList.add("display-none");
    }
}


function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight')
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight')
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

    if (value === "") {
        return;
    }

    let task = tasks.find(task => task.id === currentEditTaskId);

    if (!task) {
        return;
    }

    if (!task.subtasks) {
        task.subtasks = [];
    }

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
    let contactsHTML = document.getElementById("edit-contact-list");
    let contactLine = document.getElementById("edit-contact-line");

    contactsHTML.innerHTML = "";
    contactLine.innerHTML = "";

    let renderedContacts = 0;

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];

        let isChecked = task.contacts?.some(taskContact =>
            taskContact.firstname === contact.firstname &&
            taskContact.lastname === contact.lastname
        );

        let firstLetter = contact.firstname[0];
        let firstLetterLastName = contact.lastname[0];

        let contactColor = getContactColor(
            contact.firstname,
            contact.lastname
        );

        contactsHTML.innerHTML += getEditTaskContactTemplate(i, isChecked, contactColor, contact, firstLetter, firstLetterLastName);


        if (isChecked && renderedContacts < 3) {
            contactLine.innerHTML += `
                <div class="initials" style="background-color: ${contactColor}">
                    ${firstLetter}${firstLetterLastName}
                </div>
            `;

            renderedContacts++;
        }
    }
}

function updateEditContactLine() {
    let contactLine = document.getElementById("edit-contact-line");
    contactLine.innerHTML = "";

    let renderedContacts = 0;

    for (let i = 0; i < contacts.length; i++) {
        let checkbox = document.getElementById(`edit-contact${i}`);

        if (checkbox && checkbox.checked && renderedContacts < 3) {
            let contact = contacts[i];

            let contactColor = getContactColor(
                contact.firstname,
                contact.lastname
            );

            contactLine.innerHTML += `
                <div class="initials" style="background-color: ${contactColor}">
                    ${contact.firstname[0]}${contact.lastname[0]}
                </div>
            `;

            renderedContacts++;
        }
    }
}

async function EditTaskChanged(event, id) {
    event.preventDefault();

    let titleInput = document.getElementById("edit-title");
    let dateInput = document.getElementById("edit-date");

    let title = titleInput.value.trim();
    let description = document.getElementById("edit-description").value.trim();
    let date = dateInput.value;

    let titleError = document.getElementById("edit-title-error");
    let dateError = document.getElementById("edit-date-error");

    titleError.innerHTML = "";
    dateError.innerHTML = "";
    titleInput.classList.remove("input-error");
    dateInput.classList.remove("input-error");

    let hasError = false;


    if (title === "") {
        titleError.innerHTML = "*This field is required";
        titleInput.classList.add("input-error");
        hasError = true;
    }


    if (date === "") {
        dateError.innerHTML = "*This field is required";
        dateInput.classList.add("input-error");
        hasError = true;
    }


    if (hasError) {
        return;
    }


    let priority = document.querySelector('input[name="edit-priority"]:checked')?.value || "";


    let selectedContacts = [];

    for (let i = 0; i < contacts.length; i++) {
        let checkbox = document.getElementById(`edit-contact${i}`);

        if (checkbox && checkbox.checked) {
            selectedContacts.push({
                firstname: contacts[i].firstname,
                lastname: contacts[i].lastname
            });
        }
    }


    let task = tasks.find(task => task.id === currentEditTaskId);

    if (!task) return;


    await fetch(
        `https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks/${currentEditTaskId}.json`,
        {
            method: "PATCH",
            body: JSON.stringify({
                title: title,
                description: description,
                date: date,
                priority: priority,
                contacts: selectedContacts,
                subtasks: task.subtasks || []
            })
        }
    );


    task.title = title;
    task.description = description;
    task.date = date;
    task.priority = priority;
    task.contacts = selectedContacts;

    data[id].title = title;
    data[id].description = description;
    data[id].date = date;
    data[id].priority = priority;
    data[id].contacts = selectedContacts;
    data[id].subtasks = task.subtasks || [];


    updateHTML();
    taskOpen(id)
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
