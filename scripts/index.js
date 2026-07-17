function startAnimation() {
	const logo = document.querySelector(".startLogo");
	const overlay = document.querySelector("#startScreen");

	setTimeout(() => {
		logo.style.left = "40px";
		logo.style.top = "40px";
		logo.style.width = "100px";
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

document.addEventListener("DOMContentLoaded", startAnimation);
