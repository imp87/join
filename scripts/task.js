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
]

let tasks = [];


function toggleContactList() {
    let contactListRef = document.getElementById("contact-list");
    contactListRef.classList.toggle("display-none");
    contactListRef.innerHTML = "";
    document.getElementById("contacts-arrow").classList.toggle("upside");


    for (let iContact = 0; iContact < contacts.length; iContact++) {

        let firstLetter = contacts[iContact].firstname[0];
        let firstLetterLastName = contacts[iContact].lastname[0];

        contactListRef.innerHTML +=
            `<input class="checkbox-input" type="checkbox" id="assign-contact${iContact}"
                                            name="assign-contact${iContact}">
                                        <label class="custom-checkbox" for="assign-contact${iContact}">
                                            <span></span>
                                            <img src="./assets/img/checked.svg" alt="checked">
                                            <div class="contact-name">
                                                <div class="initials">${firstLetter}${firstLetterLastName}</div>${contacts[iContact].firstname} ${contacts[iContact].lastname}
                                            </div>
                                        </label>`

    }
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

    let task = {
        "title": title.value,
        "description": description.value,
        "date": date.value,
        "priority": priority.value,
    };

    tasks.push(task);
    console.log(tasks);
}