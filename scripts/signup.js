/**
 * Handles the signup.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {Promise<void>}
 */
async function handleSignup(event) {
    event.preventDefault();
    hideSignupError();

    let form = readSignupForm();
    let error = validateSignup(form);

    if (error) {
        showSignupError(error);
        return;
    }

    await createAccount(form);
}

/**
 * Creates the account.
 *
 * @param {Object} form - The form data.
 *
 * @returns {Promise<void>}
 */
async function createAccount(form) {
    let user = await registerUser(form.name, form.email, form.password);

    if (!user) {
        showSignupError("This email address is already registered.");
        return;
    }

    await createUserContact(form.name, form.email);
    saveSession(user);
    window.location.href = "../summary.html";
}

/**
 * Creates the user contact.
 *
 * @param {string} name - The name.
 * @param {string} email - The email.
 *
 * @returns {Promise<void>}
 */
async function createUserContact(name, email) {
    let contact = {
        name: name,
        email: email,
        phone: "",
        initials: getInitialsFromName(name),
        color: getRandomContactColor(),
    };

    await postContactToDatabase(contact);
}

/**
 * Returns the random contact color.
 *
 * @returns {string} A random contact color.
 */
function getRandomContactColor() {
    let index = Math.floor(Math.random() * contactColors.length);

    return contactColors[index];
}

/**
 * Reads the signup form.
 *
 * @returns {Object} The entered signup data.
 */
function readSignupForm() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,
        privacyAccepted: document.getElementById("checkboxPrivacy").checked,
    };
}

/**
 * Validates the signup.
 *
 * @param {Object} form - The form data.
 *
 * @returns {string} An error message or an empty string.
 */
function validateSignup(form) {
    if (!form.name || !form.email || !form.password) {
        return "Please fill in all fields.";
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
        return "Please enter a valid email address.";
    }

    if (form.password !== form.confirmPassword) {
        return "Your passwords don't match. Please try again.";
    }

    if (!form.privacyAccepted) {
        return "Please accept the Privacy Policy.";
    }

    return "";
}

/**
 * Shows the signup error.
 *
 * @param {string} message - The message.
 *
 * @returns {void}
 */
function showSignupError(message) {
    let errorRef = document.querySelector(".passwordDismatchInfo");

    errorRef.innerHTML = message;
    errorRef.style.display = "block";
}

/**
 * Hides the signup error.
 *
 * @returns {void}
 */
function hideSignupError() {
    document.querySelector(".passwordDismatchInfo").style.display = "none";
}

/**
 * Activates the signup form.
 *
 * @returns {void}
 */
function activateSignupForm() {
    let signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", handleSignup);
}

document.addEventListener("DOMContentLoaded", activateSignupForm);
