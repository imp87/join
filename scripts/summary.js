function init() {
    greeting();
}


function submenuOpen() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.showModal();
    let bodyRef = document.getElementById("body");
    bodyRef.classList.add("hidden");
}


function submenuClose() {
    let dialogRef = document.getElementById("submenu");
    dialogRef.close();
    let bodyRef = document.getElementById("body");
    bodyRef.classList.remove("hidden");
}


function logDownWBubblingProtection(event) {
    event.stopPropagation();
}


async function fetchData() {
    let response = await fetch(
        "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
    );

    data = await response.json();

    tasks = Object.entries(data).map(([id, task]) => {
        return { id: id, ...task };
    });

    toDoLength();
}

function toDoLength() {
    let toDoCount = tasks.filter(task => task.status === "To do").length;
    document.getElementById("to-do-count").innerHTML = `${toDoCount}`;

    let doneCount = tasks.filter(task => task.status === "Done").length;
    document.getElementById("done-count").innerHTML = `${doneCount}`;

    let urgentCount = tasks.filter(task => task.priority === "urgent").length;
    document.getElementById("urgent-count").innerHTML = `${urgentCount}`;

    nextUrgentDate();
    categoryCount();
}

function nextUrgentDate() {
    let urgentTasks = tasks.filter(task => task.priority === "urgent");
    urgentTasks.sort((a, b) => { return new Date(a.date) - new Date(b.date); });

    let nextUrgentDate = urgentTasks[0]?.date;

    if (nextUrgentDate) {
        let formattedDate = getFormattedDate(nextUrgentDate);
        document.getElementById("next-deadline").innerHTML = `<strong>${formattedDate}</strong>Upcoming Deadline`
    } else {
        document.getElementById("next-deadline").innerHTML = "No Upcoming Deadline";
    }
}

function getFormattedDate(nextUrgentDate) {
    return new Date(nextUrgentDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function categoryCount() {
    document.getElementById("tasks-count").innerHTML = `${tasks.length}`

    let progressCount = tasks.filter(task => task.status === "In progress").length;
    document.getElementById("progress-count").innerHTML = `${progressCount}`

    let feedbackCount = tasks.filter(task => task.status === "Await feedback").length;
    document.getElementById("feedback-count").innerHTML = `${feedbackCount}`
}

