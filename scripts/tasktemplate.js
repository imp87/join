function getTaskContactTemplate(iContact, contactColor, firstLetter, firstLetterLastName) {
    return `<input class="checkbox-input" 
            type="checkbox" 
            id="assign-contact${iContact}"
            name="assign-contact" 
            value="${contacts[iContact].firstname} ${contacts[iContact].lastname}" 
            onchange="updateSelectedContacts()">
            <label class="custom-checkbox" for="assign-contact${iContact}">
                <span></span>
                <img src="./assets/img/checked.svg" alt="checked">
                <div class="contact-name">
                    <div class="initials" style="background-color: ${contactColor};">${firstLetter}${firstLetterLastName}</div>
                    ${contacts[iContact].firstname} ${contacts[iContact].lastname}
                </div>
            </label>`
}

function getSubtaskTemplate(iSubtask) {
    return `<li class="subtask" id="subtask-${iSubtask}">
                <div class="subtask-value">
                    <span class="bullet"></span>${subtasks[iSubtask]}
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


function getEditSubtaskTemplate(iSubtask) {
    return `<div class="edit-subtask">
                <input 
                id="edit-subtask-${iSubtask}" 
                value="${subtasks[iSubtask]}">
                </input>
                <span class="delete-check">
                    <button onclick="deleteSubtask(${iSubtask})" type="button">
                        <img src="./assets/img/delete.svg" alt="delete">
                    </button>
                    <div class="line"></div>
                    <button onclick="SubtaskEdited(${iSubtask})" type="button">
                        <img src="./assets/img/checkblue.svg" alt="check">
                    </button>
                </span>
            </div>`
}