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
 * Validates the contact email and phone number.
 *
 * @returns {boolean} Whether the contact data is valid.
 */
function validateContactForm() {
    let nameInput = document.getElementById("contactNameInput");
    let emailInput = document.getElementById("contactEmailInput");
    let phoneInput = document.getElementById("contactPhoneInput");
    let nameRegex = /^[a-zA-ZäöüÄÖÜß]+(?:[ '-][a-zA-ZäöüÄÖÜß]+)*$/;
    let emailRegex = /^(?!.*\.\.)(?!\.)(?!.*\.@)[^\s@]+@(?!\.)[^\s@]+\.[^\s@]+$/;
    let phoneRegex = /^\+?\d+$/;

    return customValidity(nameInput, emailInput, phoneInput, nameRegex, emailRegex, phoneRegex);
}

/**
 * Sets custom validation messages for the contact form inputs
 * and reports their validity.
 *
 * @param {HTMLInputElement} nameInput - The name input element.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} phoneInput - The phone input element.
 * @param {RegExp} nameRegex - Regular expression for validating the name.
 * @param {RegExp} emailRegex - Regular expression for validating the email address.
 * @param {RegExp} phoneRegex - Regular expression for validating the phone number.
 * @returns {boolean} Whether all inputs are valid.
 */
function customValidity(nameInput, emailInput, phoneInput, nameRegex, emailRegex, phoneRegex) {
    nameInput.setCustomValidity(
        nameRegex.test(nameInput.value.trim()) ? "" : "Please enter a valid name."
    );
    emailInput.setCustomValidity(
        emailRegex.test(emailInput.value.trim()) ? "" : "Please enter a valid email address."
    );
    phoneInput.setCustomValidity(
        phoneRegex.test(phoneInput.value.trim()) ? "" : "Please enter numbers only."
    );

    return reportValidation(nameInput, emailInput, phoneInput);
}

/**
 * Reports the validity of the contact form inputs.
 *
 * @param {HTMLInputElement} nameInput - The name input element.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} phoneInput - The phone input element.
 * @returns {boolean} Whether all inputs are valid.
 */
function reportValidation(nameInput, emailInput, phoneInput) {
    if (!nameInput.reportValidity()) {
        return false;
    }
    if (!emailInput.reportValidity()) {
        return false;
    }
    if (!phoneInput.reportValidity()) {
        return false;
    }

    return true;
}