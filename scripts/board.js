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

function addtaskOpen() {
    let dialogRef = document.getElementById("add-task");
    dialogRef.showModal();
}

function addTaskClose() {
    let dialogRef = document.getElementById("add-task");
    dialogRef.close();
}

function taskOpen() {
    let dialogRef = document.getElementById("task");
    dialogRef.showModal();
}

function taskClose() {
    let dialogRef = document.getElementById("task");
    dialogRef.close();
}

function toggleContactList() {
    document.getElementById("contact-list").classList.toggle("display-none");
    document.getElementById("contacts-arrow").classList.toggle("upside");
}

function toggleCategoryOptions() {
    document.getElementById("category-options").classList.toggle("display-none");
    document.getElementById("category-arrow").classList.toggle("upside");
}