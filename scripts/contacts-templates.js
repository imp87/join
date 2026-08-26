function getLetterTemplate(letter) {
	return `
		<div class="contact-group-letter">${letter}</div>
		<div class="contact-separator"></div>
	`;
}

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

function getEmptyAvatarTemplate() {
	return `
		<img
			src="./assets/icons/person.svg"
			alt=""
		/>
	`;
}
