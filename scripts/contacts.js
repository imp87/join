let selectedContactIndex = -1;
let editingContactIndex = -1;
let isEditMode = false;

async function initContacts() {
	await loadContacts();
	renderContacts();
	updateContactPageMode();
}

function renderContacts() {
	sortContactsByName();

	let contactsList = document.getElementById("contactsList");
	contactsList.innerHTML = "";

	let currentLetter = "";

	for (let i = 0; i < contacts.length; i++) {
		let contact = contacts[i];
		let firstLetter = contact.name.charAt(0).toUpperCase();

		if (firstLetter !== currentLetter) {
			currentLetter = firstLetter;
			contactsList.innerHTML += getLetterTemplate(currentLetter);
		}

		contactsList.innerHTML += getContactListItemTemplate(contact, i);
	}
}

function sortContactsByName() {
	contacts.sort(function (contactA, contactB) {
		return contactA.name.localeCompare(contactB.name);
	});
}

function getLetterTemplate(letter) {
	return `
        <div class="contact-group-letter">${letter}</div>
        <div class="contact-separator"></div>
    `;
}

function getContactListItemTemplate(contact, index) {
	let activeClass = "";

	if (selectedContactIndex === index) {
		activeClass = " active";
	}

	return `
        <button
            class="contact-list-item${activeClass}"
            type="button"
            onclick="selectContact(${index})"
        >
            <span
                class="contact-avatar"
                style="background-color: ${contact.color}"
            >
                ${contact.initials}
            </span>
            <div>
                <p class="contact-name">${contact.name}</p>
                <p class="contact-email">${contact.email}</p>
            </div>
        </button>
    `;
}

function selectContact(index) {
	selectedContactIndex = index;
	renderContacts();
	renderContactDetail(index);
	updateContactPageMode();
}

function renderContactDetail(index) {
	let contact = contacts[index];
	let contactDetail = document.getElementById("contactDetail");

	contactDetail.innerHTML = `
        <div class="contact-profile">
            <div
                class="contact-avatar"
                style="background-color: ${contact.color}"
            >
                ${contact.initials}
            </div>
        <div>
            <h3>${contact.name}</h3>
            <div class="contact-actions">
                    <button
                        class="contact-action"
                        type="button"
                        onclick="openEditContactOverlay(${index})"
                    >
                        <img src="./assets/icons/edit_dark.svg" alt="" />
                        Edit
                    </button>
                    <button
                        class="contact-action"
                        type="button"
                        onclick="deleteContact(${index})"
                    >
                        <img src="./assets/icons/delete.svg" alt="" />
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <div class="contact-info">
            <h4>Contact Information</h4>
            <strong>Email</strong>
            <p><a href="mailto:${contact.email}">${contact.email}</a></p>
            <strong>Phone</strong>
            <p>${contact.phone}</p>
        </div>

        <div class="mobile-contact-actions">
            <button
                class="mobile-more-button"
                type="button"
                aria-label="Contact actions"
                onclick="toggleMobileContactActions(event)"
            >
                &#8942;
            </button>
            <div id="mobileContactActionMenu" class="mobile-action-menu">
                <button
                    type="button"
                    onclick="openEditContactOverlay(${index})"
                >
                    <img src="./assets/icons/edit_dark.svg" alt="" />
                    Edit
                </button>
                <button
                    type="button"
                    onclick="deleteContact(${index})"
                >
                    <img src="./assets/icons/delete.svg" alt="" />
                    Delete
                </button>
            </div>
        </div>
    `;
}

function openAddContactOverlay() {
	isEditMode = false;
	editingContactIndex = -1;

	setContactOverlayText("Add contact", "Tasks are better with a team!");
	setContactFormValues("", "", "");
	showEmptyAvatar();
	setOverlayButtons("Cancel", "Create contact", true);

	document.getElementById("contactOverlay").showModal();
}

function openEditContactOverlay(index) {
	isEditMode = true;
	editingContactIndex = index;

	let contact = contacts[index];

	setContactOverlayText("Edit contact", "");
	setContactFormValues(contact.name, contact.email, contact.phone);
	showContactAvatar(contact);
	setOverlayButtons("Delete", "Save", false);

	document.getElementById("contactOverlay").showModal();
}

function closeContactOverlay() {
	document.getElementById("contactOverlay").close();
}

async function saveContact(event) {
	event.preventDefault();

	let name = document.getElementById("contactNameInput").value.trim();
	let email = document.getElementById("contactEmailInput").value.trim();
	let phone = document.getElementById("contactPhoneInput").value.trim();
	let initials = getInitials(name);

	if (isEditMode) {
		await updateContact(name, email, phone, initials);
	} else {
		await createContact(name, email, phone, initials);
	}
}

async function updateContact(name, email, phone, initials) {
	let contact = contacts[editingContactIndex];

	contact.name = name;
	contact.email = email;
	contact.phone = phone;
	contact.initials = initials;

	await patchContactInDatabase(contact.id, {
		name: name,
		email: email,
		phone: phone,
		initials: initials,
	});

	closeContactOverlay();
	renderContacts();
	selectContactByEmail(email);
}

async function createContact(name, email, phone, initials) {
	let newContact = {
		name: name,
		email: email,
		phone: phone,
		initials: initials,
		color: getNextContactColor(),
	};

	await postContactToDatabase(newContact);

	closeContactOverlay();
	renderContacts();
	selectContactByEmail(email);
	showContactToast("Contact successfully created");
}

async function deleteContact(index) {
	if (index < 0) {
		return;
	}

	await deleteContactFromDatabase(contacts[index].id);

	contacts.splice(index, 1);
	selectedContactIndex = -1;

	closeContactOverlayIfOpen();
	renderContacts();
	document.getElementById("contactDetail").innerHTML = "";
	updateContactPageMode();
}

function showContactsListMobile() {
	selectedContactIndex = -1;
	renderContacts();
	document.getElementById("contactDetail").innerHTML = "";
	updateContactPageMode();
}

function updateContactPageMode() {
	let contactsPage = document.getElementById("contactsPage");

	if (!contactsPage) {
		return;
	}

	contactsPage.classList.toggle("detail-open", selectedContactIndex >= 0);
}

function toggleMobileContactActions(event) {
	event.stopPropagation();

	let menu = document.getElementById("mobileContactActionMenu");

	if (menu) {
		menu.classList.toggle("open");
	}
}

function closeContactOverlayIfOpen() {
	let overlay = document.getElementById("contactOverlay");

	if (overlay.open) {
		overlay.close();
	}
}

function setContactOverlayText(title, subtitle) {
	document.getElementById("contactOverlayTitle").textContent = title;
	document.getElementById("contactOverlaySubtitle").textContent = subtitle;
}

function setContactFormValues(name, email, phone) {
	document.getElementById("contactNameInput").value = name;
	document.getElementById("contactEmailInput").value = email;
	document.getElementById("contactPhoneInput").value = phone;
}

function setOverlayButtons(cancelText, submitText, showCloseIcon) {
	let cancelButton = document.getElementById("contactCancelButton");
	let cancelButtonText = document.getElementById("contactCancelButtonText");
	let cancelButtonIcon = document.getElementById("contactCancelButtonIcon");
	let submitButtonText = document.getElementById("contactSubmitButtonText");

	cancelButtonText.textContent = cancelText;
	submitButtonText.textContent = submitText;

	if (showCloseIcon) {
		cancelButtonIcon.style.display = "block";
		cancelButton.onclick = closeContactOverlay;
	} else {
		cancelButtonIcon.style.display = "none";
		cancelButton.onclick = function () {
			deleteContact(editingContactIndex);
		};
	}
}

function showEmptyAvatar() {
	let avatar = document.getElementById("contactOverlayAvatar");
	avatar.className = "contact-modal-avatar empty-avatar";
	avatar.style.backgroundColor = "";
	avatar.innerHTML = '<img src="./assets/icons/person.svg" alt="" />';
}

function showContactAvatar(contact) {
	let avatar = document.getElementById("contactOverlayAvatar");
	avatar.className = "contact-modal-avatar";
	avatar.style.backgroundColor = contact.color;
	avatar.innerHTML = contact.initials;
}

function getInitials(name) {
	let nameParts = name.split(" ");
	let firstInitial = "";
	let secondInitial = "";

	if (nameParts.length > 0 && nameParts[0].length > 0) {
		firstInitial = nameParts[0].charAt(0);
	}

	if (nameParts.length > 1 && nameParts[1].length > 0) {
		secondInitial = nameParts[1].charAt(0);
	}

	return (firstInitial + secondInitial).toUpperCase();
}

function getNextContactColor() {
	let colorIndex = contacts.length % contactColors.length;
	return contactColors[colorIndex];
}

function selectContactByEmail(email) {
	for (let i = 0; i < contacts.length; i++) {
		if (contacts[i].email === email) {
			selectContact(i);
			return;
		}
	}
}

function showContactToast(message) {
	let toast = document.getElementById("contactToast");
	toast.textContent = message;
	toast.classList.add("show");

	setTimeout(function () {
		toast.classList.remove("show");
	}, 1800);
}
