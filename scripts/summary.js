function init() {
    greeting();
}

function greeting() {
    let greetingRef = document.getElementById("greeting");
    greetingRef.innerHTML = "";

    let date = new Date();
    let hour = date.getHours();
    if (hour <= 12) {
        greetingRef.innerHTML = "<h5>Good morning!</h5>";
    } else if (hour <= 16) {
        greetingRef.innerHTML = "<h5>Good afternoon!</h5>";
    } else {
        greetingRef.innerHTML = "<h5>Good evening!</h5>";
    }
}


function submenuOpen() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.showModal();
}

function submenuClose() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.close();
}

function logDownWBubblingProtection(event) {
    event.stopPropagation();
}

