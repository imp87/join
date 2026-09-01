/**
 * Returns the letter template.
 *
 * @param {string} letter - The letter.
 *
 * @returns {string} The generated HTML.
 */
function getLetterTemplate(letter) {
	return `
		<div class="contact-group-letter">${letter}</div>
		<div class="contact-separator"></div>
	`;
}

/**
 * Returns the contact list item template.
 *
 * @param {Object} contact - The contact data.
 * @param {number} index - The item index.
 * @param {boolean} isActive - Whether the item is active.
 *
 * @returns {string} The generated HTML.
 */
function getContactListItemTemplate(contact, index, isActive) {
	let activeClass = isActive ? " active" : "";

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

/**
 * Returns the contact detail template.
 *
 * @param {Object} contact - The contact data.
 * @param {number} index - The item index.
 *
 * @returns {string} The generated HTML.
 */
function getContactDetailTemplate(contact, index) {
	return `
		<div class="contact-profile">
			<div
				class="contact-avatar"
				style="background-color: ${contact.color}"
			>
				${contact.initials}
			</div>

			<div>
				<h3>${contact.name}</h3>
				${getContactActionsTemplate(index)}
			</div>
		</div>

		${getContactInfoTemplate(contact)}
		${getMobileContactActionsTemplate(index)}
	`;
}

/**
 * Returns the contact actions template.
 *
 * @param {number} index - The item index.
 *
 * @returns {string} The generated HTML.
 */
function getContactActionsTemplate(index) {
	return `
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
	`;
}

/**
 * Returns the contact info template.
 *
 * @param {Object} contact - The contact data.
 *
 * @returns {string} The generated HTML.
 */
function getContactInfoTemplate(contact) {
	return `
		<div class="contact-info">
			<h4>Contact Information</h4>

			<strong>Email</strong>
			<p>
				<a href="mailto:${contact.email}">
					${contact.email}
				</a>
			</p>

			<strong>Phone</strong>
			<p>${contact.phone}</p>
		</div>
	`;
}

/**
 * Returns the mobile contact actions template.
 *
 * @param {number} index - The item index.
 *
 * @returns {string} The generated HTML.
 */
function getMobileContactActionsTemplate(index) {
	return `
		<div class="mobile-contact-actions">
			<button
				class="mobile-more-button"
				type="button"
				aria-label="Contact actions"
				onclick="toggleMobileContactActions(event)"
			>
				&#8942;
			</button>

			<div
				id="mobileContactActionMenu"
				class="mobile-action-menu"
			>
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

/**
 * Returns the empty avatar template.
 *
 * @returns {string} The generated HTML.
 */
function getEmptyAvatarTemplate() {
	return `
		<img
			src="./assets/icons/person.svg"
			alt=""
		/>
	`;
}
