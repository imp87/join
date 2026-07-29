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
    console.log(tasks)

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

        document.getElementById("next-deadline").innerHTML = formattedDate;
    } else {
        document.getElementById("next-deadline").innerHTML = "";
    }

    document.getElementById("tasks-count").innerHTML = `${tasks.length}`

    let progressCount = tasks.filter(task => task.status === "In progress").length;
    document.getElementById("progress-count").innerHTML = `${progressCount}`

    let feedbackCount = tasks.filter(task => task.status === "Await feedback").length;
    document.getElementById("feedback-count").innerHTML = `${feedbackCount}`
}
