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