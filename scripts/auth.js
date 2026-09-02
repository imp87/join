const USERS_URL =
    "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/users";

const SESSION_KEY = "joinUser";

/**
 * Loads all users from the database.
 *
 * @returns {Promise<Array<Object>>} The loaded users.
 */
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

/**
 * Saves a user in the database.
 *
 * @param {Object} user - The user data.
 *
 * @returns {Promise<string>} The new user ID.
 */
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

/**
 * Registers a new user.
 *
 * @param {string} name - The name.
 * @param {string} email - The email.
 * @param {string} password - The password.
 *
 * @returns {Promise<Object|null>} The new session or null when the email exists.
 */
async function registerUser(name, email, password) {
    let users = await loadUsers();

    if (findUserByEmail(users, email)) {
        return null;
    }

    let user = { name: name, email: email, password: password };
    let id = await postUserToDatabase(user);

    return createSession(id, user);
}

/**
 * Checks the login details.
 *
 * @param {string} email - The email.
 * @param {string} password - The password.
 *
 * @returns {Promise<Object|null>} The session or null when login fails.
 */
async function loginUser(email, password) {
    let users = await loadUsers();
    let user = findUserByEmail(users, email);

    if (!user || user.password !== password) {
        return null;
    }

    return createSession(user.id, user);
}

/**
 * Finds the user by email.
 *
 * @param {Array<Object>} users - The users.
 * @param {string} email - The email.
 *
 * @returns {Object|undefined} The matching user.
 */
function findUserByEmail(users, email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Creates session data for a user.
 *
 * @param {string} id - The item ID.
 * @param {Object} user - The user data.
 *
 * @returns {Object} The session data.
 */
function createSession(id, user) {
    return { id: id, name: user.name, email: user.email };
}

/**
 * Creates the guest session.
 *
 * @returns {Object} The guest session data.
 */
function createGuestSession() {
    return { id: "guest", name: "Guest", email: "" };
}

/**
 * Saves the current session in the browser.
 *
 * @param {Object} user - The user data.
 *
 * @returns {void}
 */
function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/**
 * Returns the current user.
 *
 * @returns {Object|null} The saved user or null.
 */
function getCurrentUser() {
    let user = localStorage.getItem(SESSION_KEY);

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

/**
 * Logs out the user.
 *
 * @returns {void}
 */
function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
}

/**
 * Creates initials from a full name.
 *
 * @param {string} name - The name.
 *
 * @returns {string} The initials.
 */
function getInitialsFromName(name) {
    let nameParts = name.trim().split(" ");
    let firstInitial = nameParts[0].charAt(0);
    let secondInitial = "";

    if (nameParts.length > 1) {
        secondInitial = nameParts[1].charAt(0);
    }

    return (firstInitial + secondInitial).toUpperCase();
}

/**
 * Displays the current user's initials.
 *
 * @returns {void}
 */
function renderUserInitials() {
    let initialsRef = document.getElementById("userInitials");
    let user = getCurrentUser();

    if (!initialsRef || !user) {
        return;
    }

    document.getElementById("initals-help").classList.remove("no-display");
    document.getElementById("menu").innerHTML = getMenuTemplate();
    initialsRef.innerHTML = getInitialsFromName(user.name);
    currentUser = user.name
}

let currentUser = "";

/**
 * Shows a greeting that matches the current time.
 *
 * @returns {void}
 */
function greeting() {
    document.getElementById("greeting").innerHTML = "";
    let userName = `, <br><span>${currentUser}</span>`;
    if (currentUser === "Guest") { userName = "!" }
    let date = new Date();
    let hour = date.getHours();
    if (hour <= 12) {
        document.getElementById("greeting").innerHTML = `<h5>Good morning${userName}</h5>`;
    } else if (hour <= 16) {
        document.getElementById("greeting").innerHTML = `<h5>Good afternoon${userName}</h5>`;
    } else {
        document.getElementById("greeting").innerHTML = `<h5>Good evening${userName}</h5>`;
    }
}

document.addEventListener("DOMContentLoaded", renderUserInitials);
