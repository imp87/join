const USERS_URL =
    "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/users";

const SESSION_KEY = "joinUser";

async function loadUsers() {
    let response = await fetch(`${USERS_URL}.json`);
    let data = await response.json();

    if (!data) {
        return [];
    }

    return Object.entries(data).map(([id, user]) => {
        return { id: id, ...user };
    });
}

async function postUserToDatabase(user) {
    let response = await fetch(`${USERS_URL}.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    let result = await response.json();

    return result.name;
}

async function registerUser(name, email, password) {
    let users = await loadUsers();

    if (findUserByEmail(users, email)) {
        return null;
    }

    let user = { name: name, email: email, password: password };
    let id = await postUserToDatabase(user);

    return createSession(id, user);
}

async function loginUser(email, password) {
    let users = await loadUsers();
    let user = findUserByEmail(users, email);

    if (!user || user.password !== password) {
        return null;
    }

    return createSession(user.id, user);
}

function findUserByEmail(users, email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function createSession(id, user) {
    return { id: id, name: user.name, email: user.email };
}

function createGuestSession() {
    return { id: "guest", name: "Guest", email: "" };
}

function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getCurrentUser() {
    let user = localStorage.getItem(SESSION_KEY);

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
}

function getInitialsFromName(name) {
    let nameParts = name.trim().split(" ");
    let firstInitial = nameParts[0].charAt(0);
    let secondInitial = "";

    if (nameParts.length > 1) {
        secondInitial = nameParts[1].charAt(0);
    }

    return (firstInitial + secondInitial).toUpperCase();
}

function renderUserInitials() {
    let initialsRef = document.getElementById("userInitials");
    let user = getCurrentUser();

    if (!initialsRef || !user) {
        return;
    }

    initialsRef.innerHTML = getInitialsFromName(user.name);
}

document.addEventListener("DOMContentLoaded", renderUserInitials);
