let selectedContacts = [];

/**
 * Toggles the contact list.
 *
 * @returns {void}
 */
function toggleContactList() {
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.toggle("display-none");
    document.getElementById("contacts-arrow").classList.toggle("upside");

    if (contactListRef.innerHTML !== "") return;
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        contactListRef.innerHTML += getTaskContactTemplate(iContact);
    }
}

/**
 * Closes the contact list.
 *
 * @returns {void}
 */
function closeContactList() {
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.add("display-none");
    document.getElementById("contacts-arrow").classList.remove("upside");
}

/**
 * Sorts the task contacts by name.
 *
 * @returns {void}
 */
function sortTaskContactsByName() {
    contacts.sort(function (contactA, contactB) {
        return contactA.name.localeCompare(contactB.name);
    });
}

/**
 * Adds or removes a contact from the task selection.
 *
 * @param {string} id - The item ID.
 *
 * @returns {void}
 */
function getSelectedContacts(id) {
    let index = contacts.findIndex(item => item.id === id);
    if (index === -1) return;

    selectedContactsPush(id, index)
    updateSelectedContacts()
}

/**
 * Updates the selected contacts list.
 *
 * @param {string} id - The item ID.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function selectedContactsPush(id, index) {
    let contact = contacts[index];
    let selectedIndex = selectedContacts.findIndex(item => item.id === id);
    if (selectedIndex === -1) {
        selectedContacts.push({
            name: contact.name,
            initials: contact.initials,
            color: contact.color,
            id: contact.id
        });
    } else {
        selectedContacts.splice(selectedIndex, 1);
    }
}

/**
 * Displays the selected contacts.
 *
 * @returns {void}
 */
function updateSelectedContacts() {
    let contactLine = document.getElementById("contact-line");
    contactLine.innerHTML = "";

    for (
        let contactIndex = 0;
        contactIndex < selectedContacts.length;
        contactIndex++
    ) {
        contactLine.innerHTML += `
        <div class="initials" style="background-color: ${selectedContacts[contactIndex].color}">${selectedContacts[contactIndex].initials}</div>
        `;
    }
}