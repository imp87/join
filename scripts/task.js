

let subtasks = []
let tasks = []

function toggleContactList() {
    loadContacts();
    sortTaskContactsByName();

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

function startResize(event) {
    event.preventDefault();

    resizing = true;
    textarea = document.getElementById("description");

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


function updateSelectedContacts() {
    let contactLine = document.getElementById("contact-line");
    contactLine.innerHTML = "";
    const checkedBoxes = document.querySelectorAll('input[name="assign-contact"]:checked');

    checkedBoxes.forEach((box, index) => {
        if (index < 3) {
            let contactIndex = box.id.replace("assign-contact", "");
            let contact = contacts[contactIndex];
            contactLine.innerHTML += `<div class="initials" style="background-color: ${contact.color}">${contact.initials}</div>`;
        }
    });
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
    const priority = document.querySelector('input[name="priority"]:checked')?.value || "";
    let category = document.getElementById("category-input");


    let assignedContacts = [];

    let checkedBoxes = document.querySelectorAll('input[name="assign-contact"]:checked');

    checkedBoxes.forEach(box => {
        let contactIndex = box.id.replace("assign-contact", "");

        assignedContacts.push({
            name: contacts[contactIndex].name,
            initials: contacts[contactIndex].initials,
            color: contacts[contactIndex].color,
        });
    });


    let validationMessage = document.querySelectorAll(".validation-message")

    if (category.value === "" || title.value === "" || date.value === "") {
        document.getElementById("custom-category-input").classList.add("input-error");
        validationMessage.forEach(element => {
            element.innerHTML = "This field is required"
        });
        title.classList.add("input-error");
        date.classList.add("input-error");
        return;
    }
    document.getElementById("custom-category-input").classList.remove("input-error");
    validationMessage.forEach(element => {
        element.innerHTML = ""
    });
    title.classList.remove("input-error");
    date.classList.remove("input-error");


    getTaskValue(title, description, date, priority, assignedContacts, category, subtasks);
    showSuccessDialog();
}


async function getTaskValue(title, description, date, priority, assignedContacts, category, subtasks) {
    let task = {
        "title": title.value,
        "description": description.value,
        "date": date.value,
        "priority": priority,
        "contacts": assignedContacts.length > 0 ? assignedContacts : "",
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

    document.querySelectorAll('input[name="assign-contact"]:checked')
        .forEach(checkbox => {
            checkbox.checked = false;
        });

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
