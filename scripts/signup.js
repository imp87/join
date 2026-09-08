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

function createSignupSuccessMessage() {
	const message = document.createElement("div");

	message.textContent = "You Signed Up successfully";
	message.classList.add("signupSuccessMessage");

	return message;
}

function playSignupSuccessAnimation() {
	return new Promise((resolve) => {
		const successMessage = createSignupSuccessMessage();

		document.body.appendChild(successMessage);

		setTimeout(() => {
			successMessage.remove();
			resolve();
		}, 1400);
	});
}

async function createAccount(form) {
	let user = await registerUser(form.name, form.email, form.password);

	if (!user) {
		showSignupError("This email address is already registered.");
		return;
	}

	await createUserContact(form.name, form.email);
	saveSession(user);

	await playSignupSuccessAnimation();

	window.location.href = "../index.html";
}

function togglePasswordVisibility(inputId, button) {
	const passwordInput = document.getElementById(inputId);
	const icon = button.querySelector("img");

	if (passwordInput.type === "password") {
		passwordInput.type = "text";
		icon.src = "../assets/icons/pw_visibility_on.svg";
		button.setAttribute("aria-label", "Hide password");
	} else {
		passwordInput.type = "password";
		icon.src = "../assets/icons/pw_visibility_off.svg";
		button.setAttribute("aria-label", "Show password");
	}
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
	if (!form.name || !form.email || !form.password || !form.confirmPassword) {
		return "Please fill in all fields.";
	}

	const emailRegex =
		/^(?!.*\.\.)(?!\.)(?!.*\.@)[^\s@]+@(?!\.)[^\s@]+\.[^\s@]+$/;

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
	const errorRef = document.querySelector(".passwordDismatchInfo");

	errorRef.textContent = message;
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
	const signupForm = document.getElementById("signupForm");
	const passwordWrappers = document.querySelectorAll(".passwordInput");

	signupForm.addEventListener("submit", handleSignup);

	passwordWrappers.forEach((wrapper) => {
		wrapper.addEventListener("focusout", hidePasswordOnFocusOut);
	});
}

function hidePasswordOnFocusOut(event) {
	const passwordWrapper = event.currentTarget;

	if (passwordWrapper.contains(event.relatedTarget)) {
		return;
	}

	const passwordInput = passwordWrapper.querySelector("input");
	const button = passwordWrapper.querySelector(".passwordVisibilityButton");
	const icon = button.querySelector("img");

	passwordInput.type = "password";
	icon.src = "../assets/icons/pw_visibility_on.svg";
	button.setAttribute("aria-label", "Show password");
}

document.addEventListener("DOMContentLoaded", activateSignupForm);
