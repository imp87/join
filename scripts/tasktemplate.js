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
                <img src="./assets/img/move.svg" alt="move" onclick="logDownWBubblingProtection(event); openMoveTo('${filteredTasks[index].status}', '${filteredTasks[index].id}');">
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
                <div id="move-to${filteredTasks[index].id}" class="move-to no-display" onclick="logDownWBubblingProtection(event);"><h5>Move to</h5></div>
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
    return `<div class="task-content" onclick="logDownWBubblingProtection(event); closeEditContactList();" id="task-content">
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


