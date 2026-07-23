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

        contactListRef.innerHTML +=
            `<input class="checkbox-input" type="checkbox" id="assign-contact${iContact}"
                                            name="assign-contact" value="${contacts[iContact].firstname} ${contacts[iContact].lastname}" onchange="updateSelectedContacts()">
                                        <label class="custom-checkbox" for="assign-contact${iContact}">
                                            <span></span>
                                            <img src="./assets/img/checked.svg" alt="checked">
                                            <div class="contact-name">
                                                <div class="initials" style="background-color: ${contactColor};">${firstLetter}${firstLetterLastName}</div>${contacts[iContact].firstname} ${contacts[iContact].lastname}
                                            </div>
                                        </label>`

    }
}


function updateSelectedContacts() {
    let contactLine = document.getElementById("contact-line");
    contactLine.innerHTML = "";

    const checkedBoxes = document.querySelectorAll('input[name="assign-contact"]:checked');

    checkedBoxes.forEach((box, index) => {
        if (index < 3) {
            const contactIndex = box.id.replace("assign-contact", "");
            const contact = contacts[contactIndex];

            let contactColor = getContactColor(contact.firstname, contact.lastname);

            contactLine.innerHTML += `
                <div class="initials" style="background-color: ${contactColor}">
                    ${contact.firstname[0]}${contact.lastname[0]}
                </div>
            `;
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
    document.getElementById("category-selected").innerHTML = category;

    toggleCategoryOptions();
}


async function addToTasks() {
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let date = document.getElementById("due-date");
    let priority = document.querySelector('input[name="priority"]:checked')?.value || "";
    const selectedContacts = [...document.querySelectorAll('input[name="assign-contact"]:checked')]
        .map(box => box.value);
    let category = document.getElementById("category-input");



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


    subtasks = [];
    console.log(tasks);

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

    console.log("Gespeicherte ID:", result.name);
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
        subtaskInteraction.innerHTML += `<li class="subtask" id="subtask-${iSubtask}"><div class="subtask-value"><span class="bullet"></span>${subtasks[iSubtask]}</div><span class="delete-edit"><button onclick="editSubtasks(${iSubtask})" type="button"><img src="./assets/img/edit.svg" alt="edit"></button><div class="line"></div><button onclick="deleteSubtask(${iSubtask})" type="button"><img src="./assets/img/delete.svg" alt="delete"></button></span></li>`
    }
}

function editSubtasks(iSubtask) {
    let subtaskRef = document.getElementById(`subtask-${iSubtask}`)

    subtaskRef.innerHTML = `<div class="edit-subtask"><input 
            id="edit-subtask-${iSubtask}" 
            value="${subtasks[iSubtask]}">
            </input>
            
            <span class="delete-check"><button onclick="deleteSubtask(${iSubtask})" type="button"><img src="./assets/img/delete.svg" alt="delete"></button><div class="line"></div><button onclick="SubtaskEdited(${iSubtask})" type="button"><img src="./assets/img/checkblue.svg" alt="check"></button></span>
            </div>`
}

function SubtaskEdited(iSubtask) {
    let editSubtaskInput = document.getElementById(`edit-subtask-${iSubtask}`)


    subtasks[iSubtask] = editSubtaskInput.value;

    renderSubtasks()
    console.log(subtasks);
}