let contactColors = [
    "#ff7a00",
    "#9327ff",
    "#6e52ff",
    "#fc71ff",
    "#ffbb2b",
    "#1fd7c1",
    "#462f8a",
    "#ffc700",
];

let contacts = [
    {
        name: "Anton Mayer",
        email: "antonm@gmail.com",
        phone: "+49 1111 111 11 1",
        initials: "AM",
        color: "#ff7a00",
    },
    {
        name: "Anja Schulz",
        email: "schulz@hotmail.com",
        phone: "+49 2222 222 22 2",
        initials: "AS",
        color: "#9327ff",
    },
    {
        name: "David Eisenberg",
        email: "davidberg@gmail.com",
        phone: "+49 4444 444 44 4",
        initials: "DE",
        color: "#fc71ff",
    },
    {
        name: "Eva Fischer",
        email: "eva@gmail.com",
        phone: "+49 5555 555 55 5",
        initials: "EF",
        color: "#ffbb2b",
    },
    {
        name: "Marcel Bauer",
        email: "bauer@gmail.com",
        phone: "+49 7777 777 77 7",
        initials: "MB",
        color: "#462f8a",
    },
    {
        name: "Tatjana Wolf",
        email: "wolf@gmail.com",
        phone: "+49 2222 222 22 2",
        initials: "TW",
        color: "#ffc700",
    },
];

function loadContacts() {
    let savedContacts = localStorage.getItem("joinContacts");

    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
    }
}

function saveContacts() {
    localStorage.setItem("joinContacts", JSON.stringify(contacts));
}
