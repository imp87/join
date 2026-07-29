let tasks = [];

function toggleContactList() {
    loadContacts();
    sortTaskContactsByName();

    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.toggle("display-none");
    contactListRef.innerHTML = "";
    document.getElementById("contacts-arrow").classList.toggle("upside");

    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let contact = contacts[iContact];

        contactListRef.innerHTML += `
            <input
                class="checkbox-input"
                type="checkbox"
                id="assign-contact${iContact}"
                name="assign-contact${iContact}"
            >
            <label class="custom-checkbox" for="assign-contact${iContact}">
                <span></span>
                <img src="./assets/img/checked.svg" alt="checked">
                <div class="contact-name">
                    <div
                        class="initials"
                        style="background-color: ${contact.color};"
                    >
                        ${contact.initials}
                    </div>
                    ${contact.name}
                </div>
            </label>
        `;
    }
}

function sortTaskContactsByName() {
    contacts.sort(function (contactA, contactB) {
        return contactA.name.localeCompare(contactB.name);
    });
}

function toggleCategoryOptions() {
    document.getElementById("category-options").classList.toggle("display-none");
    document.getElementById("category-arrow").classList.toggle("upside");
}

function addToTasks() {
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let date = document.getElementById("due-date");
    let priority = document.querySelector('input[name="priority"]:checked');
    let assignedContacts = getAssignedContacts();

    let task = {
        "title": title.value,
        "description": description.value,
        "date": date.value,
        "priority": priority.value,
        "assignedContacts": assignedContacts,
    };

    tasks.push(task);
    console.log(tasks);
}

function getAssignedContacts() {
    let assignedContacts = [];

    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let checkbox = document.getElementById("assign-contact" + iContact);

        if (checkbox && checkbox.checked) {
            assignedContacts.push(contacts[iContact]);
        }
    }

    return assignedContacts;
}
