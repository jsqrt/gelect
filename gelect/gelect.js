
class gelect {

	constructor(compEl, userSettings) {
		this.$component = document.querySelector(compEl);
		this.$root = this.$component.parentElement;
		this.$defaultOptions = this.$component.querySelectorAll('option');

		this.settings = {
			class: this.$component.classList[0],
			placeholder: this.$component.dataset.placeholder,
			ariaMessage: this.$component.dataset.ariaMessage,
			ariaLabel: this.$component.getAttribute('aria-label'),
		};
		Object.assign(this.settings, userSettings);

		this.init();
	}

	setNodes() {
		this.$wrapper = document.createElement('div');
		for (let key in this.$component.attributes) {// copy attributes from old select
			if (this.$component.attributes[key].nodeName) {
				this.$wrapper.setAttribute(this.$component.attributes[key].nodeName, this.$component.attributes[key].nodeValue);
			}
		}
		if (!this.settings.ariaLabel) {
			this.$wrapper.setAttribute('aria-label', this.settings.placeholder);
		}
		this.$wrapper.setAttribute('role', 'listbox');

		this.$trigger = document.createElement('button');
		this.$trigger.classList.add(this.settings.class + '__selected');
		this.$trigger.setAttribute('type', 'button');;
		this.$trigger.setAttribute('role', 'status');
		this.$trigger.setAttribute('aria-live', 'polite');

		this.$options = document.createElement('ul');
		this.$options.classList.add(this.settings.class + '__options');

		this.$wrapper.append(this.$trigger);
		this.$wrapper.append(this.$options);
		this.$root.append(this.$wrapper);
	}

	setOptions() {
		this.$defaultOptions.forEach((el, i) => {
			let $optionsItem = document.createElement('li');
			let $button = document.createElement('button');

			$optionsItem.classList.add(this.settings.class + '__options__item');
			$button.classList.add(this.settings.class + '__options__item__btn');
			$button.textContent = el.textContent;
			$button.setAttribute('role', 'option');
			$button.setAttribute('aria-selected', 'false');

			$button.addEventListener('click', (e) => {
				this.onHandleChange(e);
				this.dropdownClose();
			});

			$optionsItem.append($button);
			this.$options.append($optionsItem);

			if (el.dataset.selected && !this.settings.$selectedOption && !this.settings.placeholder) {
				this.setSelected($button);
			}
			else if (i === 0) {
				this.$firstOption = $button;
			}
		});
	}

	setTriggerAria() {
		if (this.$wrapper.dataset.ariaMessage) {
			this.$wrapper.setAttribute('aria-label', this.$wrapper.dataset.ariaMessage + ` ${this.$trigger.textContent}`);
		}
	}

	setSelected($button) {
		this.settings.$selectedOption = $button;
		this.settings.$selectedOption.parentElement.dataset.selected = 'true';
		this.settings.$selectedOption.setAttribute('tabindex', '-1');
		this.settings.$selectedOption.setAttribute('aria-selected', 'true')

		this.$trigger.textContent = this.settings.$selectedOption.textContent;

		this.setTriggerAria();
	}

	defineDefaultStates() {
		if (this.settings.placeholder) {
			this.$trigger.textContent = this.settings.placeholder;
		}
		else if (!this.settings.$selectedOption) {
			this.settings.$selectedOption = this.$firstOption;
			this.setSelected(this.$firstOption);
		}
		else {
		}
	}

	toggleSelected(e) {
		if (this.settings.$selectedOption) {
			this.settings.$selectedOption.parentElement.removeAttribute('data-selected');
			this.settings.$selectedOption.removeAttribute('tabindex');
			this.settings.$selectedOption.setAttribute('aria-selected', 'false')
		}

		this.settings.$selectedOption = e.target;
		this.settings.$selectedOption.parentElement.dataset.selected = 'true';
		this.settings.$selectedOption.setAttribute('tabindex', '-1');
		this.settings.$selectedOption.setAttribute('aria-selected', 'true')
	}

	dropdownOpen() {
		this.$options.dataset.state = 'active';
	}

	dropdownClose() {
		this.$options.removeAttribute('data-state');
		console.log('dropdownClose()');
	}

	onHandleChange(e) {
		this.toggleSelected(e);
		this.$trigger.textContent = e.target.textContent;

		this.setTriggerAria();
		this.$trigger.focus();
	}

	onHandleTriggerClick() {
		this.$trigger.addEventListener('click', (e) => {
			console.log('click');
			if (this.$options.dataset.state === 'active') {
				this.dropdownClose();
			} else {
				this.dropdownOpen();
			}
		});
	}

	onHandleOutsideClick() {
		window.addEventListener('click', (e) => {
			if (!this.$wrapper.contains(e.target)) {
				this.dropdownClose();
			}
		});
	}

	init() {
		this.setNodes();
		this.setOptions();
		this.defineDefaultStates();
		this.onHandleTriggerClick();
		this.onHandleOutsideClick();
	}
}
