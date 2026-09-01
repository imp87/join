let selectedContactIndex = -1;
let editingContactIndex = -1;
let isEditMode = false;

/**
 * Initializes the contacts page.
 *
 * @returns {Promise<void>}
 */
async function initContacts() {
	await loadContacts();
	renderContacts();
	updateContactPageMode();
}

/**
 * Renders the contacts.
 *
 * @returns {void}
 */
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

/**
 * Sorts the contacts by name.
 *
 * @returns {void}
 */
function sortContactsByName() {
	contacts.sort(function (contactA, contactB) {
		return contactA.name.localeCompare(contactB.name);
	});
}

/**
 * Selects the contact.
 *
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function selectContact(index) {
	selectedContactIndex = index;

	renderContacts();
	renderContactDetail(index);
	updateContactPageMode();
}

/**
 * Renders the contact detail.
 *
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function renderContactDetail(index) {
	let contactDetail = document.getElementById("contactDetail");

	contactDetail.innerHTML = getContactDetailTemplate(contacts[index], index);
}

/**
 * Opens the add contact overlay.
 *
 * @returns {void}
 */
function openAddContactOverlay() {
	setContactOverlayMode(false);

	setContactOverlayText("Add contact", "Tasks are better with a team!");

	setContactFormValues("", "", "");
	showEmptyAvatar();
	setOverlayButtons("Cancel", "Create contact", true);

	showContactOverlay();
}

/**
 * Opens the edit contact overlay.
 *
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function openEditContactOverlay(index) {
	let contact = contacts[index];

	setContactOverlayMode(true, index);

	setContactOverlayText("Edit contact", "");

	setContactFormValues(contact.name, contact.email, contact.phone);

	showContactAvatar(contact);

	setOverlayButtons("Delete", "Save", false);

	showContactOverlay();
}

/**
 * Sets the contact overlay mode.
 *
 * @param {boolean} editMode - Whether edit mode is active.
 * @param {number} index - The item index.
 *
 * @returns {void}
 */
function setContactOverlayMode(editMode, index = -1) {
	isEditMode = editMode;
	editingContactIndex = index;
}

/**
 * Shows the contact overlay.
 *
 * @returns {void}
 */
function showContactOverlay() {
	document.getElementById("contactOverlay").showModal();
}

/**
 * Closes the contact overlay.
 *
 * @returns {void}
 */
function closeContactOverlay() {
	document.getElementById("contactOverlay").close();
}

/**
 * Saves the contact.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {Promise<void>}
 */
async function saveContact(event) {
	event.preventDefault();

	let formData = getContactFormData();

	if (isEditMode) {
		await updateContact(formData);
	} else {
		await createContact(formData);
	}
}

/**
 * Returns the contact form data.
 *
 * @returns {Object} The entered contact data.
 */
function getContactFormData() {
	let name = document.getElementById("contactNameInput").value.trim();

	return {
		name: name,

		email: document.getElementById("contactEmailInput").value.trim(),

		phone: document.getElementById("contactPhoneInput").value.trim(),

		initials: getInitials(name),
	};
}

/**
 * Updates the contact.
 *
 * @param {Object} formData - The contact form data.
 *
 * @returns {Promise<void>}
 */
async function updateContact(formData) {
	let contact = contacts[editingContactIndex];

	Object.assign(contact, formData);

	await patchContactInDatabase(contact.id, formData);

	finishContactSave(formData.email);
}

/**
 * Creates the contact.
 *
 * @param {Object} formData - The contact form data.
 *
 * @returns {Promise<void>}
 */
async function createContact(formData) {
	let newContact = {
		...formData,
		color: getNextContactColor(),
	};

	await postContactToDatabase(newContact);

	finishContactSave(formData.email);

	showContactToast("Contact successfully created");
}

/**
 * Finishes saving and selects the saved contact.
 *
 * @param {string} email - The email.
 *
 * @returns {void}
 */
function finishContactSave(email) {
	closeContactOverlay();

	renderContacts();

	selectContactByEmail(email);
}

/**
 * Deletes the contact.
 *
 * @param {number} index - The item index.
 *
 * @returns {Promise<void>}
 */
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

/**
 * Returns to the contacts list on mobile screens.
 *
 * @returns {void}
 */
function showContactsListMobile() {
	selectedContactIndex = -1;

	clearContactDetail();
	renderContacts();
	updateContactPageMode();
}

/**
 * Clears the contact detail.
 *
 * @returns {void}
 */
function clearContactDetail() {
	document.getElementById("contactDetail").innerHTML = "";
}

/**
 * Updates the contact page mode.
 *
 * @returns {void}
 */
function updateContactPageMode() {
	let contactsPage = document.getElementById("contactsPage");

	if (contactsPage) {
		contactsPage.classList.toggle("detail-open", selectedContactIndex >= 0);
	}
}

/**
 * Toggles the mobile contact actions.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {void}
 */
function toggleMobileContactActions(event) {
	event.stopPropagation();

	let menu = document.getElementById("mobileContactActionMenu");

	if (menu) {
		menu.classList.toggle("open");
	}
}

/**
 * Closes the mobile contact actions.
 *
 * @returns {void}
 */
function closeMobileContactActions() {
	let menu = document.getElementById("mobileContactActionMenu");

	if (menu) {
		menu.classList.remove("open");
	}
}

/**
 * Closes the contact overlay if open.
 *
 * @returns {void}
 */
function closeContactOverlayIfOpen() {
	let overlay = document.getElementById("contactOverlay");

	if (overlay.open) {
		overlay.close();
	}
}

/**
 * Sets the contact overlay text.
 *
 * @param {string} title - The title.
 * @param {string} subtitle - The subtitle.
 *
 * @returns {void}
 */
function setContactOverlayText(title, subtitle) {
	document.getElementById("contactOverlayTitle").textContent = title;

	document.getElementById("contactOverlaySubtitle").textContent = subtitle;
}

/**
 * Sets the contact form values.
 *
 * @param {string} name - The name.
 * @param {string} email - The email.
 * @param {string} phone - The phone number.
 *
 * @returns {void}
 */
function setContactFormValues(name, email, phone) {
	document.getElementById("contactNameInput").value = name;

	document.getElementById("contactEmailInput").value = email;

	document.getElementById("contactPhoneInput").value = phone;
}

/**
 * Sets the overlay buttons.
 *
 * @param {string} cancelText - The cancel text.
 * @param {string} submitText - The submit text.
 * @param {boolean} showCloseIcon - Whether the close icon is shown.
 *
 * @returns {void}
 */
function setOverlayButtons(cancelText, submitText, showCloseIcon) {
	setOverlayButtonText(cancelText, submitText);

	setCancelButtonAction(showCloseIcon);
}

/**
 * Sets the overlay button text.
 *
 * @param {string} cancelText - The cancel text.
 * @param {string} submitText - The submit text.
 *
 * @returns {void}
 */
function setOverlayButtonText(cancelText, submitText) {
	document.getElementById("contactCancelButtonText").textContent = cancelText;

	document.getElementById("contactSubmitButtonText").textContent = submitText;
}

/**
 * Sets the action of the cancel button.
 *
 * @param {boolean} showCloseIcon - Whether the close icon is shown.
 *
 * @returns {void}
 */
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

/**
 * Shows the empty avatar.
 *
 * @returns {void}
 */
function showEmptyAvatar() {
	let avatar = document.getElementById("contactOverlayAvatar");

	avatar.className = "contact-modal-avatar empty-avatar";

	avatar.style.backgroundColor = "";

	avatar.innerHTML = getEmptyAvatarTemplate();
}

/**
 * Shows the contact avatar.
 *
 * @param {Object} contact - The contact data.
 *
 * @returns {void}
 */
function showContactAvatar(contact) {
	let avatar = document.getElementById("contactOverlayAvatar");

	avatar.className = "contact-modal-avatar";

	avatar.style.backgroundColor = contact.color;

	avatar.textContent = contact.initials;
}

/**
 * Returns the initials.
 *
 * @param {string} name - The name.
 *
 * @returns {string} The initials.
 */
function getInitials(name) {
	let nameParts = name.trim().split(/\s+/);

	let firstInitial = nameParts[0]?.charAt(0) || "";

	let secondInitial = nameParts[1]?.charAt(0) || "";

	return (firstInitial + secondInitial).toUpperCase();
}

/**
 * Returns the next contact color.
 *
 * @returns {string} The next contact color.
 */
function getNextContactColor() {
	return contactColors[contacts.length % contactColors.length];
}

/**
 * Selects the contact by email.
 *
 * @param {string} email - The email.
 *
 * @returns {void}
 */
function selectContactByEmail(email) {
	let index = contacts.findIndex(function (contact) {
		return contact.email === email;
	});

	if (index >= 0) {
		selectContact(index);
	}
}

/**
 * Shows the contact toast.
 *
 * @param {string} message - The message.
 *
 * @returns {void}
 */
function showContactToast(message) {
	let toast = document.getElementById("contactToast");

	toast.textContent = message;

	toast.classList.add("show");

	setTimeout(function () {
		toast.classList.remove("show");
	}, 1800);
}
