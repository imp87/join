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
	let currentLetter = "";

	contactsList.innerHTML = contacts
		.map(function (contact, index) {
			let firstLetter = contact.name.charAt(0).toUpperCase();
			let html = "";

			if (firstLetter !== currentLetter) {
				currentLetter = firstLetter;
				html += getLetterTemplate(currentLetter);
			}

			html += getContactListItemTemplate(
				contact,
				index,
				selectedContactIndex === index,
			);

			return html;
		})
		.join("");
}

function sortContactsByName() {
	contacts.sort(function (contactA, contactB) {
		return contactA.name.localeCompare(contactB.name);
	});
}

function selectContact(index) {
	selectedContactIndex = index;

	renderContacts();
	renderContactDetail(index);
	updateContactPageMode();
}

function renderContactDetail(index) {
	let contactDetail = document.getElementById("contactDetail");

	contactDetail.innerHTML = getContactDetailTemplate(contacts[index], index);
}

function openAddContactOverlay() {
	setContactOverlayMode(false);

	setContactOverlayText("Add contact", "Tasks are better with a team!");

	setContactFormValues("", "", "");
	showEmptyAvatar();
	setOverlayButtons("Cancel", "Create contact", true);

	showContactOverlay();
}

function openEditContactOverlay(index) {
	let contact = contacts[index];

	setContactOverlayMode(true, index);

	setContactOverlayText("Edit contact", "");

	setContactFormValues(contact.name, contact.email, contact.phone);

	showContactAvatar(contact);

	setOverlayButtons("Delete", "Save", false);

	showContactOverlay();
}

function setContactOverlayMode(editMode, index = -1) {
	isEditMode = editMode;
	editingContactIndex = index;
}

function showContactOverlay() {
	document.getElementById("contactOverlay").showModal();
}

function closeContactOverlay() {
	document.getElementById("contactOverlay").close();
}

async function saveContact(event) {
	event.preventDefault();

	let formData = getContactFormData();

	if (isEditMode) {
		await updateContact(formData);
	} else {
		await createContact(formData);
	}
}

function getContactFormData() {
	let name = document.getElementById("contactNameInput").value.trim();

	return {
		name: name,

		email: document.getElementById("contactEmailInput").value.trim(),

		phone: document.getElementById("contactPhoneInput").value.trim(),

		initials: getInitials(name),
	};
}

async function updateContact(formData) {
	let contact = contacts[editingContactIndex];

	Object.assign(contact, formData);

	await patchContactInDatabase(contact.id, formData);

	finishContactSave(formData.email);
}

async function createContact(formData) {
	let newContact = {
		...formData,
		color: getNextContactColor(),
	};

	await postContactToDatabase(newContact);

	finishContactSave(formData.email);

	showContactToast("Contact successfully created");
}

function finishContactSave(email) {
	closeContactOverlay();

	renderContacts();

	selectContactByEmail(email);
}

async function deleteContact(index) {
	if (index < 0) {
		return;
	}

	await deleteContactFromDatabase(contacts[index].id);

	contacts.splice(index, 1);

	selectedContactIndex = -1;

	closeContactOverlayIfOpen();
	clearContactDetail();
	renderContacts();
	updateContactPageMode();
}

function showContactsListMobile() {
	selectedContactIndex = -1;

	clearContactDetail();
	renderContacts();
	updateContactPageMode();
}

function clearContactDetail() {
	document.getElementById("contactDetail").innerHTML = "";
}

function updateContactPageMode() {
	let contactsPage = document.getElementById("contactsPage");

	if (contactsPage) {
		contactsPage.classList.toggle("detail-open", selectedContactIndex >= 0);
	}
}

function toggleMobileContactActions(event) {
	event.stopPropagation();

	let menu = document.getElementById("mobileContactActionMenu");

	if (menu) {
		menu.classList.toggle("open");
	}
}

function closeMobileContactActions() {
	let menu = document.getElementById("mobileContactActionMenu");

	if (menu) {
		menu.classList.remove("open");
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
	setOverlayButtonText(cancelText, submitText);

	setCancelButtonAction(showCloseIcon);
}

function setOverlayButtonText(cancelText, submitText) {
	document.getElementById("contactCancelButtonText").textContent = cancelText;

	document.getElementById("contactSubmitButtonText").textContent = submitText;
}

function setCancelButtonAction(showCloseIcon) {
	let cancelButton = document.getElementById("contactCancelButton");

	let cancelButtonIcon = document.getElementById("contactCancelButtonIcon");

	cancelButtonIcon.style.display = showCloseIcon ? "block" : "none";

	if (showCloseIcon) {
		cancelButton.onclick = closeContactOverlay;
	} else {
		cancelButton.onclick = function () {
			deleteContact(editingContactIndex);
		};
	}
}

function showEmptyAvatar() {
	let avatar = document.getElementById("contactOverlayAvatar");

	avatar.className = "contact-modal-avatar empty-avatar";

	avatar.style.backgroundColor = "";

	avatar.innerHTML = getEmptyAvatarTemplate();
}

function showContactAvatar(contact) {
	let avatar = document.getElementById("contactOverlayAvatar");

	avatar.className = "contact-modal-avatar";

	avatar.style.backgroundColor = contact.color;

	avatar.textContent = contact.initials;
}

function getInitials(name) {
	let nameParts = name.trim().split(/\s+/);

	let firstInitial = nameParts[0]?.charAt(0) || "";

	let secondInitial = nameParts[1]?.charAt(0) || "";

	return (firstInitial + secondInitial).toUpperCase();
}

function getNextContactColor() {
	return contactColors[contacts.length % contactColors.length];
}

function selectContactByEmail(email) {
	let index = contacts.findIndex(function (contact) {
		return contact.email === email;
	});

	if (index >= 0) {
		selectContact(index);
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
