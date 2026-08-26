let selectedContacts = [];
let subtasks = []
let tasks = []

function toggleContactList() {
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.toggle("display-none");
    document.getElementById("contacts-arrow").classList.toggle("upside");

    if (contactListRef.innerHTML !== "") return;
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        contactListRef.innerHTML += getTaskContactTemplate(iContact);
    }
}

function closeContactList() {
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.add("display-none");
    document.getElementById("contacts-arrow").classList.remove("upside");
}

let resizing = false;
let textarea;
let startY;
let startHeight;

function startResize(event, id) {
    event.preventDefault();

    resizing = true;
    textarea = document.getElementById(id);

    startY = event.clientY;
    startHeight = textarea.offsetHeight;

    document.addEventListener("mousemove", resizeTextarea);
    document.addEventListener("mouseup", stopResize);
}

function resizeTextarea(event) {
    if (!resizing) return;

    let heightChange = event.clientY - startY;
    let newHeight = startHeight + heightChange;

    newHeight = Math.max(120, Math.min(newHeight, 180));

    textarea.style.height = `${newHeight}px`;
}

function stopResize() {
    resizing = false;

    document.removeEventListener("mousemove", resizeTextarea);
    document.removeEventListener("mouseup", stopResize);
}

function limitTextarea(textarea) {
    const maxHeight = 180;
    const minHeight = 120;

    textarea.style.height = `${minHeight}px`;

    if (textarea.scrollHeight > maxHeight) {
        textarea.value = textarea.value.slice(0, -1);
        textarea.style.height = `${maxHeight}px`;
        return;
    }

    textarea.style.height = `${textarea.scrollHeight}px`;
}

function sortTaskContactsByName() {
    contacts.sort(function (contactA, contactB) {
        return contactA.name.localeCompare(contactB.name);
    });
}

function getSelectedContacts(id) {
    let index = contacts.findIndex(item => item.id === id);
    if (index === -1) return;

    selectedContactsPush(id, index)
    updateSelectedContacts()
}

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

function updateSelectedContacts() {
    let contactLine = document.getElementById("contact-line");
    contactLine.innerHTML = "";

    for (
        let contactIndex = 0;
        contactIndex < selectedContacts.length && contactIndex < 3;
        contactIndex++
    ) {
        contactLine.innerHTML += `
        <div class="initials" style="background-color: ${selectedContacts[contactIndex].color}">${selectedContacts[contactIndex].initials}</div>
        `;
    }
}

function toggleCategoryOptions() {
    document.getElementById("category-options").classList.toggle("display-none");
    document.getElementById("category-arrow").classList.toggle("upside");
}

function closeCategoryOptions() {
    document.getElementById("category-options").classList.add("display-none");
    document.getElementById("category-arrow").classList.remove("upside");
}

function selectCategory(category) {
    document.getElementById("category-input").value = category;

    toggleCategoryOptions();
}

async function addToTasks(event) {
    event.preventDefault();
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let date = document.getElementById("due-date");
    let priority = document.querySelector('input[name="priority"]:checked')?.value || "";
    let category = document.getElementById("category-input");
    let validationMessage = document.querySelectorAll(".validation-message");

    if (category.value === "" || title.value === "" || date.value === "") {
        return errorMessage(validationMessage, title);
    }
    messageTaskSuccess(validationMessage, title, description, date, priority, category, subtasks);
}

function messageTaskSuccess(validationMessage, title, description, date, priority, category, subtasks) {
    removeErrorMessage(validationMessage, title, date);
    getTaskValue(title, description, date, priority, category, subtasks);
    showSuccessDialog();
}

function errorMessage(validationMessage, title) {
    document.getElementById("custom-category-input").classList.add("input-error");
    validationMessage.forEach(element => { element.innerHTML = "This field is required" });
    title.classList.add("input-error");
    document.getElementById("date-input").classList.add("input-error");
    return;
}

function removeErrorMessage(validationMessage, title, date) {
    document.getElementById("custom-category-input").classList.remove("input-error");
    validationMessage.forEach(element => { element.innerHTML = "" });
    title.classList.remove("input-error");
    document.getElementById("date-input").classList.remove("input-error");
}

async function getTaskValue(title, description, date, priority, category, subtasks) {
    let task = {
        "title": title.value,
        "description": description.value,
        "date": date.value,
        "priority": priority,
        "contacts": selectedContacts.length > 0 ? selectedContacts : "",
        "category": category.value,
        "subtasks": subtasks.length > 0 ? subtasks : "",
        "status": "To do"
    };
    postToDatabase(task)
}

async function postToDatabase(task) {
    let response = await fetch(
        "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks.json",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        }
    );
    let result = await response.json();
}

function clearSubtask() {
    let subtaskInput = document.getElementById("subtask");
    subtaskInput.value = "";
}

function addSubtask() {
    let subtaskInput = document.getElementById("subtask");

    if (subtaskInput.value.length >= 3) {
        subtasks.push({
            text: subtaskInput.value,
            done: false
        });
        subtaskInput.value = "";
        renderSubtasks()
    }
    console.log(subtasks);
}

function deleteSubtask(iSubtask) {
    subtasks.splice(iSubtask, 1);

    renderSubtasks()
    console.log(subtasks);
}

function renderSubtasks() {
    let subtaskInteraction = document.getElementById("subtask-interaction");
    subtaskInteraction.innerHTML = "";

    for (let iSubtask = 0; iSubtask < subtasks.length; iSubtask++) {
        subtaskInteraction.innerHTML += getSubtaskTemplate(iSubtask);
    }
}

function editSubtasks(iSubtask) {
    let subtaskRef = document.getElementById(`subtask-${iSubtask}`)

    subtaskRef.innerHTML = getEditSubtaskTemplate(iSubtask);
}

function subtaskEdited(iSubtask) {
    let editSubtaskInput = document.getElementById(`edit-subtask-${iSubtask}`)
    subtasks[iSubtask].text = editSubtaskInput.value;

    renderSubtasks()
}

function clearTaskForm() {
    let form = document.getElementById("task-form");
    form.reset();

    document.getElementById("category-input").value = "";
    document.querySelectorAll('input[name="assign-contact"]:checked').forEach(checkbox => { checkbox.checked = false; });
    document.getElementById("contact-line").innerHTML = "";
    document.getElementById("subtask-interaction").innerHTML = "";
    subtasks = [];
}

function showSuccessDialog() {
    let dialog = document.getElementById("success-dialog");

    dialog.showModal();

    setTimeout(() => {
        dialog.close();
        window.location.href = "./board.html";
    }, 2000);
}

function setMinDate() {
    let dateInput = document.getElementById("due-date");

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}

function searchContacts() {
    let searchValue = document.getElementById("contacts").value.toLowerCase();
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.remove("display-none");

    let filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    contactListRef.innerHTML = "";

    for (let iContact = 0; iContact < filteredContacts.length; iContact++) {
        contactListRef.innerHTML += getFilteredTaskContactTemplate(filteredContacts, iContact);
    }
}

function searchEditContacts() {
    let searchValue = document.getElementById("edit-contacts").value.toLowerCase();
    let contactListRef = document.getElementById("edit-contact-list");
    contactListRef.classList.remove("display-none");
    let filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    contactListRef.innerHTML = "";

    for (let iContact = 0; iContact < filteredContacts.length; iContact++) {
        contactListRef.innerHTML += getFilteredEditTaskContactTemplate(filteredContacts, iContact);
    }
}

function getSelectedEditContacts(id) {
    let index = contacts.findIndex(item => item.id === id);
    if (index === -1) return;

    selectedEditContactsPush(id, index)
    updateSelectedEditContacts()
}

function selectedEditContactsPush(id, index) {
    let contact = contacts[index];
    let selectedIndex = selectedEditContacts.findIndex(item => item.id === id);
    if (selectedIndex === -1) {
        selectedEditContacts.push({
            name: contact.name,
            initials: contact.initials,
            color: contact.color,
            id: contact.id
        });
    } else {
        selectedEditContacts.splice(selectedIndex, 1);
    }
}

function updateSelectedEditContacts() {
    let contactLine = document.getElementById("edit-contact-line");
    contactLine.innerHTML = "";

    for (
        let contactIndex = 0;
        contactIndex < selectedEditContacts.length && contactIndex < 3;
        contactIndex++
    ) {
        contactLine.innerHTML += `
        <div class="initials" style="background-color: ${selectedEditContacts[contactIndex].color}">${selectedEditContacts[contactIndex].initials}</div>
        `;
    }
}