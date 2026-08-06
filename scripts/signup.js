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

function getRandomContactColor() {
    let index = Math.floor(Math.random() * contactColors.length);

    return contactColors[index];
}

function readSignupForm() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,
        privacyAccepted: document.getElementById("checkboxPrivacy").checked,
    };
}

function validateSignup(form) {
    if (!form.name || !form.email || !form.password) {
        return "Please fill in all fields.";
    }

    if (form.password !== form.confirmPassword) {
        return "Your passwords don't match. Please try again.";
    }

    if (!form.privacyAccepted) {
        return "Please accept the Privacy Policy.";
    }

    return "";
}

function showSignupError(message) {
    let errorRef = document.querySelector(".passwordDismatchInfo");

    errorRef.innerHTML = message;
    errorRef.style.display = "block";
}

function hideSignupError() {
    document.querySelector(".passwordDismatchInfo").style.display = "none";
}

function activateSignupForm() {
    let signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", handleSignup);
}

document.addEventListener("DOMContentLoaded", activateSignupForm);
