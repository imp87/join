/**
 * Returns the task contact template.
 *
 * @param {number} iContact - The contact index.
 *
 * @returns {string} The generated HTML.
 */
function getTaskContactTemplate(iContact) {
    let contact = contacts[iContact];

    let isChecked = selectedContacts.some(
        selected => selected.id === contact.id
    );

    return `<input class="checkbox-input" 
            type="checkbox" 
            id="assign-contact${iContact}"
            name="assign-contact" 
            value="${contacts[iContact].name}" 
            onchange="getSelectedContacts('${contacts[iContact].id}');"
            ${isChecked ? "checked" : ""}>
            <label class="custom-checkbox" for="assign-contact${iContact}">
                <span></span>
                <img src="./assets/img/checked.svg" alt="checked">
                <div class="contact-name">
                    <div class="initials" style="background-color: ${contacts[iContact].color};">${contacts[iContact].initials}</div>
                    ${contacts[iContact].name}
                </div>
            </label>`
}

/**
 * Returns the filtered task contact template.
 *
 * @param {Array<Object>} filteredContacts - The filtered contacts.
 * @param {number} iContact - The contact index.
 *
 * @returns {string} The generated HTML.
 */
function getFilteredTaskContactTemplate(filteredContacts, iContact) {
    let contact = filteredContacts[iContact];

    let isChecked = selectedContacts.some(
        selected => selected.id === contact.id
    );

    return `<input class="checkbox-input" 
            type="checkbox" 
            id="assign-contact${iContact}"
            name="assign-contact" 
            value="${filteredContacts[iContact].name}" 
            onchange="getSelectedContacts('${filteredContacts[iContact].id}');"
            ${isChecked ? "checked" : ""}>
            <label class="custom-checkbox" for="assign-contact${iContact}">
                <span></span>
                <img src="./assets/img/checked.svg" alt="checked">
                <div class="contact-name">
                    <div class="initials" style="background-color: ${filteredContacts[iContact].color};">${filteredContacts[iContact].initials}</div>
                    ${filteredContacts[iContact].name}
                </div>
            </label>`
}

/**
 * Returns the filtered edit task contact template.
 *
 * @param {Array<Object>} filteredContacts - The filtered contacts.
 * @param {number} iContact - The contact index.
 *
 * @returns {string} The generated HTML.
 */
function getFilteredEditTaskContactTemplate(filteredContacts, iContact) {
    let contact = filteredContacts[iContact];

    let isChecked = selectedEditContacts.some(
        selected => selected.id === contact.id
    );

    return `<input class="checkbox-input" 
            type="checkbox" 
            id="assign-contact${iContact}"
            name="assign-contact" 
            value="${filteredContacts[iContact].name}" 
            onchange="getSelectedEditContacts('${filteredContacts[iContact].id}');"
            ${isChecked ? "checked" : ""}>
            <label class="custom-checkbox" for="assign-contact${iContact}">
                <span></span>
                <img src="./assets/img/checked.svg" alt="checked">
                <div class="contact-name">
                    <div class="initials" style="background-color: ${filteredContacts[iContact].color};">${filteredContacts[iContact].initials}</div>
                    ${filteredContacts[iContact].name}
                </div>
            </label>`
}

/**
 * Returns the subtask template.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {string} The generated HTML.
 */
function getSubtaskTemplate(iSubtask) {
    return `<li class="subtask" id="subtask-${iSubtask}">
                <div class="subtask-value">
                    <span class="bullet"></span>${subtasks[iSubtask].text}
                </div>
                <span class="delete-edit">
                    <button onclick="editSubtasks(${iSubtask})" type="button">
                        <img src="./assets/img/edit.svg" alt="edit">
                    </button>
                    <div class="line"></div>
                    <button onclick="deleteSubtask(${iSubtask})" type="button">
                        <img src="./assets/img/delete.svg" alt="delete">
                    </button>
                    </span>
            </li>`
}

/**
 * Returns the edit subtask template.
 *
 * @param {number} iSubtask - The subtask index.
 *
 * @returns {string} The generated HTML.
 */
function getEditSubtaskTemplate(iSubtask) {
    return `<div class="edit-subtask">
                <input 
                id="edit-subtask-${iSubtask}" 
                value="${subtasks[iSubtask].text}">
                </input>
                <span class="delete-check">
                    <button onclick="deleteSubtask(${iSubtask})" type="button">
                        <img src="./assets/img/delete.svg" alt="delete">
                    </button>
                    <div class="line"></div>
                    <button onclick="subtaskEdited(${iSubtask})" type="button">
                        <img src="./assets/img/checkblue.svg" alt="check">
                    </button>
                </span>
            </div>`
}

/**
 * Returns the filtered tasks template.
 *
 * @param {Array<Object>} filteredTasks - The filtered tasks.
 * @param {number} index - The item index.
 * @param {string} description - The description.
 *
 * @returns {string} The generated HTML.
 */
function getFilteredTasksTemplate(filteredTasks, index, description) {
    return `
        <button class="task-card" draggable="true" 
            ondragstart="startDragging('${filteredTasks[index].id}')"
            onclick="taskOpen('${filteredTasks[index].id}'); logDownWBubblingProtection(event);">
            <div class=task-card-title>
            <h4 class="${filteredTasks[index].category}">
                ${filteredTasks[index].category}
            </h4>
                <img src="./assets/img/move.svg" alt="move">
                </div>

            <p>
                <strong>${filteredTasks[index].title}</strong>
                <span id="description-${filteredTasks[index].id}">
                    ${description}
                </span>
            </p>

            <div class="progress-bar" id="progress-bar-${filteredTasks[index].id}">
            </div>

            <div class="user-prio" id="user-prio-${filteredTasks[index].id}">
                <span id="task-card-contacts-${filteredTasks[index].id}"></span>
                <div id="task-card-priority-${filteredTasks[index].id}"></div>
            </div>

        </button>
    `;
}

/**
 * Returns the open task template.
 *
 * @param {string} id - The item ID.
 *
 * @returns {string} The generated HTML.
 */
function getOpenTaskTemplate(id) {
    return `<div class="task-content" onclick="logDownWBubblingProtection(event)" id="task-content">
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
                    <div id="open-task-priority-div'${id}'">
                    </div>
                </div>

                <div class="task-assigned-to" id="task-assigned-to'${id}'">
                    <span class="task-info-title">Assigned To:</span>
                    <div id="task-card-open-contact-list" class="task-card-open-contact-list">
                    </div>
                </div>

                <div class="task-subtasks" id="task-subtasks'${id}'">
                    <span class="task-info-title">Subtasks</span>
                    <div class="task-open-subtasks" id="task-open-subtasks"></div>
                </div>

                <div class="task-bottom">
                    <button onclick="deleteTask('${id}')">
                        <img src="./assets/img/delete.svg" alt="delete"/>Delete
                    </button>
                    <div class="line"></div>
                    <button onclick="editTask('${id}')">
                        <img src="./assets/img/edit.svg" alt="edit" />Edit
                    </button>
                </div>
            </div>`
}

/**
 * Returns the open task subtask template.
 *
 * @param {string} id - The item ID.
 * @param {number} index - The item index.
 * @param {Array<Object>} subtasks - The subtasks.
 *
 * @returns {string} The generated HTML.
 */
function getOpenTaskSubtaskTemplate(id, index, subtasks) {
    return `<div>
                <input 
                    type="checkbox" 
                    id="subtask${index}" 
                    class="subtask-input"
                    onchange="updateSubtaskProgress('${id}', ${index})"
                    ${subtasks[index].done ? "checked" : ""}>

                <label for="subtask${index}" class="subtask-checkbox">
                    <span></span>
                    <img src="./assets/img/checked2.svg" alt="checked"/>
                </label>

                ${subtasks[index].text}
            </div>`
}

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

                    <div class="custom-selectbox" onclick="toggleEditContactList()">
                        <input 
                            type="search" 
                            id="edit-contacts"
                            placeholder="Select contacts to assign"
                            oninput="searchEditContacts();">

                        <div id="contacts-arrow" class="arrow">
                            <img src="./assets/img/arrow_drop_down.svg" alt="arrow">
                        </div>
                    </div>


                    <div class="contact-list display-none edit-contact-list" id="edit-contact-list">

                       

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

/**menu Template */
function getMenuTemplate() {
   return`<a class="menu-top" href="../summary.html"><img src="../assets/img/Vector.svg" alt="summary icon" />Summary</a>
          <a class="menu-top" href="../task.html"><img src="../assets/img/edit_square.svg" alt="add task icon" />Add Task</a>
          <a class="menu-top" href="../board.html"><img src="../assets/img/Icons.svg" alt="board icon" />Board</a>
          <a class="menu-top" href="../contacts.html"><img src="../assets/img/perm_contact_calendar.svg" alt="contacts icon" />Contacts</a>`
}
