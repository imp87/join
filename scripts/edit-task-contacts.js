/**
 * Toggles the edit contact list.
 *
 * @returns {void}
 */
function toggleEditContactList() {
    document.getElementById("edit-contact-list").classList.toggle("display-none");
}

/**
 * Closes the edit contact list.
 *
 * @returns {void}
 */
function closeEditContactList() {
   document.getElementById("edit-contact-list")?.classList.add("display-none"); 
}

/**
 * Renders the contacts in the edit form.
 *
 * @param {Object} task - The task data.
 *
 * @returns {void}
 */
function generateEditContacts(task) {
    let renderedContacts = 0;
    let contactLine = document.getElementById("edit-contact-line");
    contactLine.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let isChecked = task.contacts?.some(taskContact => taskContact.name === contact.name && taskContact.initials === contact.initials && taskContact.color === contact.color);
        document.getElementById("edit-contact-list").innerHTML += getEditTaskContactTemplate(i, isChecked, contact);
        if (isChecked) {
            contactLine.innerHTML += `<div class="initials" style="background-color: ${contact.color}">${contact.initials}</div>`;
            renderedContacts++;
        } if (isChecked) {
            selectedEditContacts.push(contact);
        }
    }
}

/**
 * Adds a contact avatar to the edit view.
 *
 * @param {HTMLElement} contactLine - The contact line element.
 * @param {Object} contact - The contact data.
 * @param {number} renderedContacts - The number of rendered contacts.
 *
 * @returns {void}
 */
function editContactLine(contactLine, contact, renderedContacts) {
    contactLine.innerHTML += `<div class="initials" style="background-color: ${contact.color}">${contact.initials}</div>`;
    renderedContacts++;
}

/**
 * Updates the edit contact line.
 *
 * @returns {void}
 */
function updateEditContactLine() {
    let contactLine = document.getElementById("edit-contact-line");
    contactLine.innerHTML = "";
    let renderedContacts = 0;
    for (let i = 0; i < contacts.length; i++) {
        let checkbox = document.getElementById(`edit-contact${i}`);
        if (checkbox && checkbox.checked) {
            let contact = contacts[i];
            contactLine.innerHTML += `<div class="initials" style="background-color: ${contact.color}">${contact.initials}</div>`;
            renderedContacts++;
        }
    }
}
