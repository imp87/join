function getLogoTarget() {
	if (window.matchMedia("(max-width: 800px)").matches) {
		return { left: "16px", top: "16px", width: "64px" };
	}
	return { left: "40px", top: "40px", width: "100px" };
}

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

function goToSummary() {
	window.location.href = "./summary.html";
}

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

function handleGuestLogin() {
	saveSession(createGuestSession());
	goToSummary();
}

function showLoginError() {
	document.getElementById("loginError").style.display = "block";
}

function hideLoginError() {
	document.getElementById("loginError").style.display = "none";
}

function activateLoginButtons() {
	let loginForm = document.getElementById("loginForm");
	let guestLoginButton = document.getElementById("guestLogin");

	loginForm.addEventListener("submit", handleLogin);
	guestLoginButton.addEventListener("click", handleGuestLogin);
}

document.addEventListener("DOMContentLoaded", startAnimation);
document.addEventListener("DOMContentLoaded", activateLoginButtons);
