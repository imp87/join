/**
 * Returns the logo target.
 *
 * @returns {Object} The target logo position and size.
 */
function getLogoTarget() {
	const headerLogo = document.querySelector(".loginHeader img");
	const position = headerLogo.getBoundingClientRect();

	return {
		left: `${position.left}px`,
		top: `${position.top}px`,
		width: `${position.width}px`,
	};
}

/**
 * Starts the animation.
 *
 * @returns {void}
 */
function startAnimation() {
	const logo = document.querySelector(".startLogo");
	const overlay = document.querySelector("#startScreen");
	const target = getLogoTarget();

	setTimeout(() => {
		logo.style.left = target.left;
		logo.style.top = target.top;
		logo.style.width = target.width;
		logo.style.transform = "translate(0, 0)";
	}, 100);

	setTimeout(() => {
		overlay.style.transition = "opacity 300ms ease";
		overlay.style.opacity = "0";
	}, 1000);

	setTimeout(() => {
		overlay.remove();
	}, 1300);
}

/**
 * Navigates to the summary page.
 *
 * @returns {void}
 */
function goToSummary() {
	window.location.href = "./summary.html";
}

/**
 * Handles a login form submission.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {Promise<void>}
 */
async function handleLogin(event) {
	event.preventDefault();
	hideLoginError();

	let email = document.getElementById("loginEmail").value.trim();
	let password = document.getElementById("loginPassword").value;
	let user = await loginUser(email, password);

	if (!user) {
		showLoginError();
		return;
	}

	saveSession(user);
	goToSummary();
}

/**
 * Starts a guest session.
 *
 * @returns {void}
 */
function handleGuestLogin() {
	saveSession(createGuestSession());
	goToSummary();
}

/**
 * Shows the login error.
 *
 * @returns {void}
 */
function showLoginError() {
	document.getElementById("loginError").style.display = "block";
}

/**
 * Hides the login error.
 *
 * @returns {void}
 */
function hideLoginError() {
	document.getElementById("loginError").style.display = "none";
}

/**
 * Activates the login buttons.
 *
 * @returns {void}
 */
function activateLoginButtons() {
	let loginForm = document.getElementById("loginForm");
	let guestLoginButton = document.getElementById("guestLogin");

	loginForm.addEventListener("submit", handleLogin);
	guestLoginButton.addEventListener("click", handleGuestLogin);
}

document.addEventListener("DOMContentLoaded", startAnimation);
document.addEventListener("DOMContentLoaded", activateLoginButtons);
