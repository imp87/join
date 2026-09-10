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
 * Renders the contacts list.
 *
 * @returns {void} 
 */
function renderContacts() {
	sortContactsByName();
	let contactsList = document.getElementById("contactsList");
	let currentLetter = "";
	contactsList.innerHTML = contacts
		.map(function (contact, index) {
			return getContacts(currentLetter, contact, index)
		})
		.join("");
}

/**
 * Generates the HTML for a contact including its first-letter section.
 *
 * @param {string} currentLetter - The currently displayed first letter.
 * @param {Object} contact - The contact to render.
 * @param {number} index - The index of the contact in the contacts array.
 * @returns {string} The generated HTML for the contact.
 */
function getContacts(currentLetter, contact, index) {
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
 * Saves the contact.
 *
 * @param {Event} event - The browser event.
 *
 * @returns {Promise<void>}
 */
async function saveContact(event) {
	event.preventDefault();

	if (!validateContactForm()) {
		return;
	}

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
