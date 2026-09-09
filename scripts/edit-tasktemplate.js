/**
 * Returns the edit task template.
 *
 * @param {string} id - The item ID.
 * @param {Object} task - The task data.
 *
 * @returns {string} The generated HTML.
 */
function getEditTaskTemplate(id, task) {
    return `<div class="task-content-top" style="justify-content: flex-end;">
            <button onclick="taskClose()">
                <img src="./assets/img/cancel.svg" alt="close">
            </button>
        </div>

        <form onsubmit="editTaskChanged(event, '${id}')">
        <div class="edit-task">
            <div class="form-area-fields">
                <label for="edit-title">Title</label>
                <input 
                    id="edit-title" 
                    type="text" 
                    placeholder="Enter a title" 
                    value="${task.title}">
                    <div class="edit-validation-message" id="edit-title-error"></div>
            </div>


            <div class="form-area-fields edit-fields">
                <label for="edit-description">Description</label>
                
                <div class="custom-textarea">
                    <textarea oninput="limitTextarea(this);" id="edit-description" name="edit-description"
                      placeholder="Enter a Description">${task.description}</textarea>
                    <img src="./assets/img/Recurso.svg" alt="Recurso" class="resize-handle"
                      onmousedown="startResize(event, 'edit-description')" draggable="false">
                  </div>
            </div>


            <div class="form-area-fields edit-fields">
                <label for="edit-date">Due date</label>
                    <div id="edit-date-input" class="date-input" onclick="setMinEditDate(); document.getElementById('edit-date').showPicker();">
                      <input type="date" id="edit-date" name="edit-date" value="${task.date}"  required />
                      <img src="./assets/img/event.svg" alt="calender">
                    </div>
                
                    <div class="edit-validation-message" id="edit-date-error"></div>
            </div>


            <div class="form-area-fields edit-fields">
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


            <div class="form-area-fields edit-fields">
                <label for="edit-contacts">Assigned to</label>

                <div class="assigned-to">

                    <div class="custom-selectbox" onclick="logDownWBubblingProtection(event); toggleEditContactList();">
                        <input 
                            type="search" 
                            id="edit-contacts"
                            placeholder="Select contacts to assign"
                            oninput="searchEditContacts();">

                        <div id="contacts-arrow" class="arrow">
                            <img src="./assets/img/arrow_drop_down.svg" alt="arrow">
                        </div>
                    </div>


                    <div class="contact-list display-none edit-contact-list" id="edit-contact-list" onclick="logDownWBubblingProtection(event);">

                       

                    </div>
                </div>
                <div id="edit-contact-line" class="contact-line"></div>
            </div>


            <div class="form-area-fields edit-fields">
                <label for="edit-subtask">Subtasks</label>
                  <div class="subtask-input-container">
                    <input id="edit-subtask" type="text" placeholder="Add new subtask" />

                    <div class="subtask-actions">
                      <button onclick="editClearSubtask()" type="button"><img src="./assets/img/cancel.svg"
                          alt="close"></button>
                      <div class="line"></div>
                      <button onclick="editAddSubtask()" type="button"><img src="./assets/img/checkblue.svg"
                          alt="check"></button>
                    </div>
                    </div>
                    <ul class="subtask-interaction" id="edit-subtask-interaction"></ul>
                  </div>
        </div>

            <button type="submit" class="Ok">
                Ok
                <img src="./assets/img/check.svg" alt="check">
            </button>
        </form>`
}

/**
 * Returns the edit task subtask template.
 *
 * @param {number} iSubtask - The subtask index.
 * @param {Object} task - The task data.
 *
 * @returns {string} The generated HTML.
 */
function getEditTaskSubtaskTemplate(iSubtask, task) {
    return `
            <li class="subtask" id="subtask-${iSubtask}">
                <div class="subtask-value">
                    <span class="bullet"></span>
                    ${task.subtasks[iSubtask].text}
                </div>

                <span class="delete-edit">
                    <button onclick="editEditSubtasks(${iSubtask})" type="button">
                        <img src="./assets/img/edit.svg">
                    </button>

                    <div class="line"></div>

                    <button onclick="editDeleteSubtask(${iSubtask})" type="button">
                        <img src="./assets/img/delete.svg">
                    </button>
                </span>
            </li>
        `
}

/**
 * Returns the edit task edit subtask template.
 *
 * @param {number} iSubtask - The subtask index.
 * @param {Object} task - The task data.
 *
 * @returns {string} The generated HTML.
 */
function getEditTaskEditSubtaskTemplate(iSubtask, task) {
    return `<div class="edit-subtask">
            <input 
                id="edit-edit-subtask-${iSubtask}" 
                value="${task.subtasks[iSubtask].text}">

            <span class="delete-check">

                <button onclick="editDeleteSubtask(${iSubtask})" type="button">
                    <img src="./assets/img/delete.svg">
                </button>

                <div class="line"></div>

                <button onclick="saveEditedSubtask(${iSubtask})" type="button">
                    <img src="./assets/img/checkblue.svg">
                </button>
            </span>
        </div>`
}

/**
 * Returns the edit task contact template.
 *
 * @param {number} i - The item index.
 * @param {boolean} isChecked - Whether the contact is selected.
 * @param {Object} contact - The contact data.
 *
 * @returns {string} The generated HTML.
 */
function getEditTaskContactTemplate(i, isChecked, contact) {
    return `<input 
                class="checkbox-input" 
                type="checkbox"
                id="edit-contact${i}"
                onchange="updateEditContactLine(); getSelectedEditContacts('${contact.id}');"
                ${isChecked ? "checked" : ""}>

            <label class="custom-checkbox" for="edit-contact${i}">
                <span></span>
                <img src="./assets/img/checked.svg" alt="checked">

                <div class="contact-name">
                    <div class="initials" style="background-color: ${contact.color}">
                        ${contact.initials}
                    </div>
                    ${contact.name}
                </div>
            </label>`
}