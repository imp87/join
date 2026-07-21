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