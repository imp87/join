let contacts = [
    {
        "firstname": "Armin",
        "lastname": "Alert"
    },
    {
        "firstname": "Eren",
        "lastname": "Jäger"
    },
    {
        "firstname": "Mikasa",
        "lastname": "Ackermann"
    },
    {
        "firstname": "Levi",
        "lastname": "Ackermann"
    }
]


let colors = [
    "rgba(255, 122, 0, 1)",
    "rgba(255, 94, 179, 1)",
    "rgba(110, 82, 255, 1)",
    "rgba(147, 39, 255, 1)",
    "rgba(0, 190, 232, 1)",
    "rgba(31, 215, 193, 1)",
    "rgba(255, 116, 94, 1)",
    "rgba(255, 163, 94, 1)",
    "rgba(252, 113, 255, 1)",
    "rgba(255, 199, 1, 1)",
    "rgba(0, 56, 255, 1)",
    "rgba(195, 255, 43, 1)",
    "rgba(255, 230, 43, 1)",
    "rgba(255, 70, 70, 1)",
    "rgba(255, 187, 43, 1)"
]


let tasks = [];
let subtasks = []


function toggleContactList() {
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.toggle("display-none");
    document.getElementById("contacts-arrow").classList.toggle("upside");

    if (contactListRef.innerHTML !== "") return;
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let firstLetter = contacts[iContact].firstname[0];
        let firstLetterLastName = contacts[iContact].lastname[0];
        let contactColor = getContactColor(contacts[iContact].firstname, contacts[iContact].lastname);
        contactListRef.innerHTML += getTaskContactTemplate(iContact, contactColor, firstLetter, firstLetterLastName);
    }
}


function updateSelectedContacts() {
    let contactLine = document.getElementById("contact-line");
    contactLine.innerHTML = "";
    const checkedBoxes = document.querySelectorAll('input[name="assign-contact"]:checked');

    checkedBoxes.forEach((box, index) => {
        if (index < 3) {
            let contactIndex = box.id.replace("assign-contact", "");
            let contact = contacts[contactIndex];
            let contactColor = getContactColor(contact.firstname, contact.lastname);
            contactLine.innerHTML += `<div class="initials" style="background-color: ${contactColor}">${contact.firstname[0]}${contact.lastname[0]}</div>`;
        }
    });
}


function getContactColor(firstname, lastname) {
    let letters = (firstname[0] + lastname[0]).toUpperCase();
    let sum = letters.charCodeAt(0) + letters.charCodeAt(1);

    return colors[sum % colors.length];
}


function toggleCategoryOptions() {
    document.getElementById("category-options").classList.toggle("display-none");
    document.getElementById("category-arrow").classList.toggle("upside");
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
    const selectedContacts = [...document.querySelectorAll('input[name="assign-contact"]:checked')].map(box => box.value);
    let category = document.getElementById("category-input");

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


    getTaskValue(title, description, date, priority, selectedContacts, category, subtasks);

}


async function getTaskValue(title, description, date, priority, selectedContacts, category, subtasks) {
    let task = {
        "title": title.value,
        "description": description.value,
        "date": date.value,
        "priority": priority,
        "contacts": selectedContacts,
        "category": category.value,
        "subtasks": subtasks,
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
    subtasks = [];
}


function clearSubtask() {
    let subtaskInput = document.getElementById("subtask");
    subtaskInput.value = "";
}


function addSubtask() {
    let subtaskInput = document.getElementById("subtask");

    subtasks.push(subtaskInput.value);
    subtaskInput.value = "";

    renderSubtasks()
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


function SubtaskEdited(iSubtask) {
    let editSubtaskInput = document.getElementById(`edit-subtask-${iSubtask}`)
    subtasks[iSubtask] = editSubtaskInput.value;

    renderSubtasks()
}