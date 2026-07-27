let currentDraggedElement;


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

    dialogRef.innerHTML = ` <div class="task-content" onclick="logDownWBubblingProtection(event)" id="task-content">
          <div class="task-content-top">
            <h4 class="${data[id].category}">${data[id].category}</h4>
            <button onclick="taskClose()">
              <img src="./assets/img/cancel.svg" alt="close" />
            </button>
          </div>
          <h1>${data[id].title}</h1>
          <p>${data[id].description}</p>

          <div class="dateandprio">
            <span class="task-info-title">Due date:</span>${data[id].date}
          </div>
          <div class="dateandprio" id="task-open-priority'${id}'">
            <span class="task-info-title">Priority:</span>
            <div>
              ${priorityFirstLetter}<img src="./assets/img/${priority}.svg" alt="medium" />
            </div>
          </div>

          <div class="task-assigned-to" id="task-assigned-to'${id}'">
            <span class="task-info-title">Assigned To:</span>
            <div id="task-card-open-contact-list" class="task-card-open-contact-list">
            </div>
          </div>

          <div class="task-subtasks" id="task-subtasks'${id}'">
            <span class="task-info-title">Subtasks</span>
            <div class="task-open-subtasks" id="task-open-subtasks">
            </div>
          </div>
          <div class="task-bottom">
            <button onclick="deleteTask('${id}')">
              <img src="./assets/img/delete.svg" alt="delete" />Delete
            </button>
            <div class="line"></div>
            <button onclick="editTask('${id}')">
              <img src="./assets/img/edit.svg" alt="edit" />Edit
            </button>
          </div>
        </div>`

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

    for (let index = 0; index < data[id].subtasks.length; index++) {
        taskOpenSubtasksRef.innerHTML += `<div>
              <input type="checkbox" id="subtask${index}" name="subtask${index}" class="subtask-input" />
              <label for="subtask${index}" class="subtask-checkbox">
                <span></span>
                <img src="./assets/img/checked2.svg" alt="checked"/>
              </label>
              ${data[id].subtasks[index]}
            </div>`;

    }
}

function taskClose() {
    let dialogRef = document.getElementById("task");
    dialogRef.close();
}

let data = [];



async function updateHTML() {
    let response = await fetch(
        "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
    );

    data = await response.json();

    tasks = Object.entries(data).map(([id, task]) => {
        return { id: id, ...task };
    });

    console.log(data);

    renderTasksByStatus("To do", "to-do");
    renderTasksByStatus("In progress", "in-progress");
    renderTasksByStatus("Await feedback", "await-feedback");
    renderTasksByStatus("Done", "done");
}


function renderTasksByStatus(status, containerId) {
    let filteredTasks = tasks.filter(t => t.status == status);
    let container = document.getElementById(containerId);

    container.innerHTML = "";

    for (let index = 0; index < filteredTasks.length; index++) {
        let description = filteredTasks[index].description;
        description = description.length > 45
            ? description.slice(0, 45) + "..."
            : description;

        container.innerHTML += generateTaskElement(filteredTasks, index, description);
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

function generateTaskElement(filteredTasks, index, description) {
    return `<button class="task-card" draggable="true" ondragstart="startDragging('${filteredTasks[index].id}')" onclick="taskOpen('${filteredTasks[index].id}'); logDownWBubblingProtection(event);">
            <h4 class="${filteredTasks[index].category}">${filteredTasks[index].category}</h4>
            <p>
              <strong>${filteredTasks[index].title}</strong>
              <span id="description'${filteredTasks[index].id}'">${description}</span>
            </p>
            <div class="progress-bar" id="progress-bar'${filteredTasks[index].id}'">
            </div>
            <div class="user-prio" id="user-prio'${filteredTasks[index].id}'">
              <span id="task-card-contacts'${filteredTasks[index].id}'"></span>
              <div id="task-card-priority'${filteredTasks[index].id}'"></div>
            </div>
          </button>`;
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
    if (document.getElementById(`description'${filteredTasks[index].id}'`).innerHTML === "") {
        document.getElementById(`description'${filteredTasks[index].id}'`).classList.add("display-none");
    }
}


function taskCardUserPrio(filteredTasks, index) {
    if (
        document.getElementById(`task-card-priority'${filteredTasks[index].id}'`).innerHTML === "" &&
        document.getElementById(`task-card-contacts'${filteredTasks[index].id}'`).innerHTML === ""
    ) {
        document.getElementById(`user-prio'${filteredTasks[index].id}'`).classList.add("display-none");
    }
}

function taskCardPriority(filteredTasks, index) {
    if (filteredTasks[index].priority === "urgent") {
        document.getElementById(`task-card-priority'${filteredTasks[index].id}'`).innerHTML = `
        <img src="./assets/img/urgent.svg" alt="urgent" />`;
    } else if (filteredTasks[index].priority === "medium") {
        document.getElementById(`task-card-priority'${filteredTasks[index].id}'`).innerHTML = `
        <img src="./assets/img/medium.svg" alt="medium" />`;
    } else if (filteredTasks[index].priority === "low") {
        document.getElementById(`task-card-priority'${filteredTasks[index].id}'`).innerHTML = `
        <img src="./assets/img/low.svg" alt="low" />`;
    } else {
        document.getElementById(`task-card-priority'${filteredTasks[index].id}'`).innerHTML = "";
    }
}

function subtasksProgressBar(filteredTasks, index) {
    if (filteredTasks[index].subtasks != "") {
        document.getElementById(`progress-bar'${filteredTasks[index].id}'`).innerHTML = `
        <progress id="subtasks" value="1" max="2"></progress>
        <label for="subtasks">1/2 Subtasks</label>`;
    } else {
        document.getElementById(`progress-bar'${filteredTasks[index].id}'`).classList.add("display-none");
    }
}


function taskCardContacts(filteredTasks, index) {
    if (filteredTasks[index].contacts != "") {
        let taskCardContactsRef = document.getElementById(`task-card-contacts'${filteredTasks[index].id}'`);
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
        document.getElementById(`task-card-contacts'${filteredTasks[index].id}'`).classList.add("display-none");
    }
}


function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight')
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight')
}



function editTask(id) {
    let task = tasks.find(task => task.id === id);

    if (!task) return;

    let taskRef = document.getElementById("task-content");
    taskRef.innerHTML = "";

    taskRef.innerHTML = `
        <div class="task-content-top" style="justify-content: flex-end;">
            <button onclick="taskClose()">
                <img src="./assets/img/cancel.svg" alt="close">
            </button>
        </div>

        <form>
        <div class="edit-task">
            <div class="form-area-fields">
                <label for="edit-title">Title</label>
                <input 
                    id="edit-title" 
                    type="text" 
                    placeholder="Enter a title" 
                    value="${task.title}">
            </div>


            <div class="form-area-fields">
                <label for="edit-description">Description</label>
                <textarea 
                    id="edit-description" 
                    rows="4" 
                    cols="20"
                    placeholder="Enter a Description">${task.description}</textarea>
            </div>


            <div class="form-area-fields">
                <label for="edit-date">Due date</label>
                <input 
                    type="date" 
                    id="edit-date" 
                    value="${task.date}" 
                    required>
            </div>


            <div class="form-area-fields">
                <legend>Priority</legend>

                <div class="priority">

                    <input 
                        class="radio__input" 
                        type="radio" 
                        id="edit-urgent" 
                        name="edit-priority"
                        value="urgent"
                        ${task.priority === "urgent" ? "checked" : ""}>

                    <label class="radio__label-urgent" for="edit-urgent">
                        Urgent 
                        <img src="./assets/img/urgent.svg" alt="urgent">
                    </label>



                    <input 
                        class="radio__input" 
                        type="radio" 
                        id="edit-medium" 
                        name="edit-priority"
                        value="medium"
                        ${task.priority === "medium" ? "checked" : ""}>

                    <label class="radio__label-medium" for="edit-medium">
                        Medium 
                        <img src="./assets/img/medium.svg" alt="medium">
                    </label>



                    <input 
                        class="radio__input" 
                        type="radio" 
                        id="edit-low" 
                        name="edit-priority"
                        value="low"
                        ${task.priority === "low" ? "checked" : ""}>

                    <label class="radio__label-low" for="edit-low">
                        Low 
                        <img src="./assets/img/low.svg" alt="low">
                    </label>

                </div>
            </div>


            <div class="form-area-fields">
                <label for="edit-contacts">Assigned to</label>

                <div class="assigned-to">

                    <div class="custom-selectbox" onclick="toggleEditContactList()">
                        <input 
                            type="search" 
                            id="edit-contacts"
                            placeholder="Select contacts to assign">

                        <div id="contacts-arrow" class="arrow">
                            <img src="./assets/img/arrow_drop_down.svg" alt="arrow">
                        </div>
                    </div>


                    <div class="contact-list display-none edit-contact-list" id="edit-contact-list">

                       

                    </div>
                </div>
                <div id="edit-contact-line" class="contact-line"></div>
            </div>


            <div class="form-area-fields">
                <label for="edit-subtask">Subtasks</label>
                  <div class="subtask-input-container">
                    <input id="subtask" type="text" placeholder="Add new subtask" />

                    <div class="subtask-actions">
                      <button onclick="clearSubtask()" type="button"><img src="./assets/img/cancel.svg"
                          alt="close"></button>
                      <div class="line"></div>
                      <button onclick="addSubtask()" type="button"><img src="./assets/img/checkblue.svg"
                          alt="check"></button>
                    </div>
                    </div>
                    <ul class="subtask-interaction" id="edit-subtask-interaction"></ul>
                  </div>
        </div>

            <button class="Ok" onclick="taskChanged('${task.id}')">
                <input type="submit" value="Ok">
                <img src="./assets/img/check.svg" alt="check">
            </button>
        </form>
    `;
    generateEditContacts(task);
    generateEditSubtasks(task);
}

function generateEditSubtasks(task) {
    let subtaskRef = document.getElementById("edit-subtask-interaction");
    subtaskRef.innerHTML = "";

    if (!task.subtasks || task.subtasks.length === 0) {
        return;
    }

    for (let iSubtask = 0; iSubtask < task.subtasks.length; iSubtask++) {
        subtaskRef.innerHTML += getSubtaskTemplate(iSubtask, task.subtasks[iSubtask]);
    }

}


function toggleEditContactList() {
    document.getElementById("edit-contact-list").classList.toggle("display-none");
}

function generateEditContacts(task) {
    let contactsHTML = document.getElementById("edit-contact-list");
    let contactLine = document.getElementById("edit-contact-line");
    contactsHTML.innerHTML = "";
    contactLine.innerHTML = "";

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

        contactsHTML.innerHTML += `
            <input 
                class="checkbox-input" 
                type="checkbox"
                id="edit-contact${i}"
                ${isChecked ? "checked" : ""}>

            <label class="custom-checkbox" for="edit-contact${i}">
                <span></span>
                <img src="./assets/img/checked.svg" alt="checked">

                <div class="contact-name">
                    <div class="initials" style="background-color: ${contactColor}">
                        ${firstLetter}${firstLetterLastName}
                    </div>
                    ${contact.firstname} ${contact.lastname}
                </div>
            </label>
        `;

        if (i < 3) {
            let contactColor = getContactColor(contact.firstname, contact.lastname);
            contactLine.innerHTML += `<div class="initials" style="background-color: ${contactColor}">${contact.firstname[0]}${contact.lastname[0]}</div>`;
        }
    }

}


function taskChanged() {
    let taskRef = document.getElementById("task-content");
    taskRef.innerHTML = "";

    taskRef.innerHTML = `                    <div class="task-content-top">
                        <h4>User Story</h4><button onclick="taskClose()"><img src="./assets/img/cancel.svg"
                                alt="close"></button>
                    </div>
                    <h1>Kochwelt Page & Recipe Recommender</h1>
                    <p>
                        Build start page with recipe recommendation.
                    </p>

                    <div class="dateandprio"><span class="task-info-title">Due date:</span>10/05/2023</div>
                    <div class="dateandprio"><span class="task-info-title">Priority:</span>
                        <div>Medium<img src="./assets/img/Prio media.svg" alt="medium"></div>
                    </div>

                    <div class="task-assigned-to"><span class="task-info-title">Assigned To:</span>
                        <div class="person">
                            <div>AA</div>
                            <span>Armin Alert</span>
                        </div>
                        <div class="person">
                            <div style="background-color: rgba(31, 215, 193, 1)">EJ</div>
                            <span>Eren Jäger</span>
                        </div>
                        <div class="person">
                            <div style="background-color: rgba(31, 215, 193, 1)">MA</div>
                            <span>Mikasa Ackermann</span>
                        </div>
                    </div>

                    <div class="task-subtasks">
                        <span class="task-info-title">Subtasks</span>

                        <div>
                            <input type="checkbox" id="subtask1" name="subtask1" class="subtask-input">
                            <label for="subtask1" class="subtask-checkbox">
                                <span></span>
                                <img src="./assets/img/checked2.svg" alt="checked">
                            </label>
                            Implement Recipe Recommendation
                        </div>

                        <div>
                            <input type="checkbox" id="subtask2" name="subtask2" class="subtask-input">
                            <label for="subtask2" class="subtask-checkbox">
                                <span></span>
                                <img src="./assets/img/checked2.svg" alt="checked">
                            </label>
                            Start Page Layout
                        </div>
                    </div>
                    <div class="task-bottom">
                        <button><img src="./assets/img/delete.svg" alt="delete">Delete</button>
                        <div class="line"></div>
                        <button onclick="editTask();"><img src="./assets/img/edit.svg" alt="edit">Edit</button>
                    </div>`
}