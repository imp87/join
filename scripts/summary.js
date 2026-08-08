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

    let urgentTasks = tasks.filter(task => task.priority === "urgent");
    urgentTasks.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    let nextUrgentDate = urgentTasks[0]?.date;

    if (nextUrgentDate) {
        let formattedDate = new Date(nextUrgentDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        document.getElementById("next-deadline").innerHTML = `<strong>${formattedDate}</strong>
              Upcoming Deadline`
    } else {
        document.getElementById("next-deadline").innerHTML = "No Upcoming Deadline";
    }

    document.getElementById("tasks-count").innerHTML = `${tasks.length}`

    let progressCount = tasks.filter(task => task.status === "In progress").length;
    document.getElementById("progress-count").innerHTML = `${progressCount}`

    let feedbackCount = tasks.filter(task => task.status === "Await feedback").length;
    document.getElementById("feedback-count").innerHTML = `${feedbackCount}`
}




let greetingShown = false;
let wasDesktop = window.innerWidth >= 1440;

let fadeTimeout;
let hideTimeout;

function handleGreeting() {
    let greeting = document.getElementById("greeting");
    let summary = document.getElementById("summary");
    let title = document.getElementById("summary-title");

    clearTimeout(fadeTimeout);
    clearTimeout(hideTimeout);

    if (window.innerWidth >= 1440) {
        greeting.style.display = "";
        greeting.classList.remove("fade-out");
        greeting.classList.add("show");

        summary.style.display = "";
        title.style.display = "";
        greetingShown = false;
        return;
    }

    if (greetingShown) return;

    greetingShown = true;

    summary.style.display = "none";
    title.style.display = "none";

    greeting.style.display = "";
    greeting.classList.remove("fade-out");
    greeting.classList.add("show");

    fadeTimeout = setTimeout(() => {
        greeting.classList.add("fade-out");
    }, 2000);

    hideTimeout = setTimeout(() => {
        greeting.style.display = "none";
        summary.style.display = "";
        title.style.display = "";
    }, 2600);
}

window.addEventListener("load", handleGreeting);

window.addEventListener("resize", () => {
    let isDesktop = window.innerWidth >= 1440;

    if (wasDesktop && !isDesktop) {
        greetingShown = false;
        handleGreeting();
    }

    if (!wasDesktop && isDesktop) {
        handleGreeting();
    }

    wasDesktop = isDesktop;
});