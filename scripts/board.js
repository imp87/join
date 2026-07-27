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



function taskOpen() {
    let dialogRef = document.getElementById("task");
    dialogRef.showModal();
}

function taskClose() {
    let dialogRef = document.getElementById("task");
    dialogRef.close();
}


async function updateHTML() {
    let response = await fetch(
        "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
    );

    let data = await response.json();

    let tasks = Object.values(data);


    let toDo = tasks.filter(t => t['status'] == "To do");
    let toDoRef = document.getElementById("to-do");
    toDoRef.innerHTML = "";

    for (let iToDo = 0; iToDo < toDo.length; iToDo++) {
        toDoRef.innerHTML += generateTaskElement(toDo, iToDo);
        subtasksProgressBar(toDo, iToDo);
        taskCardContacts(toDo, iToDo);
        taskCardPriority(toDo, iToDo);
        taskCardUserPrio(toDo, iToDo);
        taskCardDescription(toDo, iToDo);
    }

    let inProgress = tasks.filter(t => t['status'] == "In progress");
    let inProgressRef = document.getElementById("in-progress");
    inProgressRef.innerHTML = "";

    for (let iInProgress = 0; iInProgress < inProgress.length; iInProgress++) {
        const element = array[iInProgress];
        inProgressRef.innerHTML += generateTaskElement(inProgress, iInProgress);
        subtasksProgressBar(inProgress, iInProgress);
        taskCardContacts(inProgress, iInProgress);
        taskCardPriority(inProgress, iInProgress);
        taskCardUserPrio(inProgress, iInProgress);
        taskCardDescription(inProgress, iInProgress);
    }

}


function startDragging(iToDo) {
    currentDraggedElement = iToDo;
}

function generateTaskElement(toDo, iToDo) {
    return `<button class="task-card" draggable="true" ondragstart="startDragging(${iToDo})">
            <h4 class="${toDo[iToDo].category}">${toDo[iToDo].category}</h4>
            <p>
              <strong>${toDo[iToDo].title}</strong>
              <span id="description${iToDo}">${toDo[iToDo].description}</span>
            </p>
            <div class="progress-bar" id=progress-bar${iToDo}>
            </div>
            <div class="user-prio" id="user-prio${iToDo}">
              <span id="task-card-contacts${iToDo}"></span>
              <div id="task-card-priority${iToDo}"></div>
            </div>
          </button>`
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
}

function taskCardDescription(toDo, iToDo) {
    let description = toDo[iToDo].description;
    document.getElementById(`description${iToDo}`).textContent = description.length > 45 ? description.slice(0, 45) + "..." : description;

    if (document.getElementById(`description${iToDo}`).innerHTML === "") {
        document.getElementById(`description${iToDo}`).classList.add("display-none");
    }
}

function taskCardUserPrio(toDo, iToDo) {
    if (document.getElementById(`task-card-priority${iToDo}`).innerHTML === "" && document.getElementById(`task-card-contacts${iToDo}`).innerHTML === "") {
        document.getElementById(`user-prio${iToDo}`).classList.add("display-none");
    }
}

function taskCardPriority(toDo, iToDo) {
    if (toDo[iToDo].priority === "urgent") {
        document.getElementById(`task-card-priority${iToDo}`).innerHTML = `              
        <img src="./assets/img/urgent.svg" alt="urgent" />`
    } else if (toDo[iToDo].priority === "medium") {
        document.getElementById(`task-card-priority${iToDo}`).innerHTML = `              
        <img src="./assets/img/medium.svg" alt="medium" />`
    } else if (toDo[iToDo].priority === "low") {
        document.getElementById(`task-card-priority${iToDo}`).innerHTML = `              
        <img src="./assets/img/low.svg" alt="low" />`
    } else if (toDo[iToDo].priority === "") {
        document.getElementById(`task-card-priority${iToDo}`).innerHTML = "";
    }
}

function subtasksProgressBar(toDo, iToDo) {
    if (toDo[iToDo].subtasks != "") {
        document.getElementById(`progress-bar${iToDo}`).innerHTML = `              
        <progress id="subtasks" value="1" max="2"></progress>
              <label for="subtasks">1/2 Subtasks</label>`
    } else {
        document.getElementById(`progress-bar${iToDo}`).classList.add("display-none");
    }

}

function taskCardContacts(toDo, iToDo) {
    if (toDo[iToDo].contacts != "") {
        let taskCardContactsRef = document.getElementById(`task-card-contacts${iToDo}`);
        taskCardContactsRef.innerHTML = "";
        for (let itaskCardContacts = 0; itaskCardContacts < toDo[iToDo].contacts.length; itaskCardContacts++) {
            let firstLetter = toDo[iToDo].contacts[itaskCardContacts].firstname[0];
            let firstLetterLastName = toDo[iToDo].contacts[itaskCardContacts].lastname[0];
            let contactColor = getContactColor(toDo[iToDo].contacts[itaskCardContacts].firstname, toDo[iToDo].contacts[itaskCardContacts].lastname);
            taskCardContactsRef.innerHTML += `<div style= "background-color: ${contactColor};">${firstLetter}${firstLetterLastName}</div>`

        }
    } else {
        document.getElementById(`task-card-contacts${iToDo}`).classList.add("display-none");
    }
}



function editTask() {
    let taskRef = document.getElementById("task-content");
    taskRef.innerHTML = "";

    taskRef.innerHTML = `       
                        <div class="task-content-top" style="justify-content: flex-end;">
                    <button onclick="taskClose()"><img src="./assets/img/cancel.svg"
                                alt="close"></button>
                    </div>     
            <form action="">
           
                <div class="form-area-fields">
                    <label for="title">Title</label>
                    <input id="title" type="text" placeholder="Enter a title" required>
                </div>

                <div class="form-area-fields">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="4" cols="20"
                        placeholder="Enter a Description"></textarea>
                </div>

                <div class="form-area-fields">
                    <label for="due-date">Due date</label>
                    <input type="date" id="due-date" name="due-date" required>
                </div>

                <div class="form-area-fields">
                    <legend>Priority</legend>
                        <div class="priority">
                            <input class="radio__input" type="radio" id="urgent" name="priority"
                                value="urgent">
                                <label class="radio__label-urgent" for="urgent">Urgent <img
                                    src="./assets/img/urgent.svg" alt="urgent"></label>

                            <input class="radio__input" type="radio" id="medium" name="priority"
                                value="medium">
                                        <label class="radio__label-medium" for="medium">Medium <img
                                                src="./assets/img/medium.svg" alt="medium"></label>

                                        <input class="radio__input" type="radio" id="low" name="priority" value="low">
                                        <label class="radio__label-low" for="low">Low <img src="./assets/img/low.svg"
                                                alt="low"></label>
                                    </div>
                                   </div> 



                                                                   <div class="form-area-fields">
                                    <label for="contacts">Assigned to</label>
                                    <div class="assigned-to">
                                        <div class="custom-selectbox" onclick="toggleContactList()">
                                            <input type="search" id="contacts" name="contacts"
                                                placeholder="Select contacts to assign">
                                            <div id="contacts-arrow" class="arrow"><img
                                                    src="./assets/img/arrow_drop_down.svg" alt="arrow_drop_down"></div>
                                        </div>

                                        <div class="contact-list display-none" id="contact-list">

                                            <input class="checkbox-input" type="checkbox" id="assign-contact1"
                                                name="assign-contact1">
                                            <label class="custom-checkbox" for="assign-contact1">
                                                <span></span>
                                                <img src="./assets/img/checked.svg" alt="checked">
                                                <div class="contact-name">
                                                    <div>AA</div>Armin Alert
                                                </div>
                                            </label>

                                            <input class="checkbox-input" type="checkbox" id="assign-contact2"
                                                name="assign-contact2">
                                            <label class="custom-checkbox" for="assign-contact2">
                                                <span></span>
                                                <img src="./assets/img/checked.svg" alt="checked">
                                                <div class="contact-name">
                                                    <div style="background-color: rgba(0, 190, 232, 1);">EJ</div>Eren
                                                    Jäger
                                                </div>
                                            </label>

                                            <input class="checkbox-input" type="checkbox" id="assign-contact3"
                                                name="assign-contact3">
                                            <label class="custom-checkbox" for="assign-contact3">
                                                <span></span>
                                                <img src="./assets/img/checked.svg" alt="checked">
                                                <div class="contact-name">
                                                    <div style="background-color: rgba(0, 190, 232, 1);">AA</div>Mikasa
                                                    Ackermann
                                                </div>
                                            </label>

                                        </div>
                                    </div>
                                </div>
           
                                <div class="form-area-fields">
                                    <label for="subtask">Subtasks</label>
                                    <input id="subtask" type="text" placeholder="Add new subtask">
                                </div>

                       
<button class="Ok" onclick="taskChanged();"><input type="submit" value="Ok"><img
                                        src="./assets/img/check.svg" alt="check"></button>

            </form>            `
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