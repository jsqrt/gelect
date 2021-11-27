class Gelect {

	get CLASSNAMES() {
		this.wrapper = 'gelect';
		this.hiddenSelect = 'gelect_hidden';
		this.trigger = this.wrapper + '__selected';
		this.list = this.wrapper + '__options'
		this.listItem = this.list + '__item';
		this.option = this.listItem + '__btn';

		return this;
	}

	constructor($select, userSettings) {
		this.$defaultSelect = $select;

		if (this.$defaultSelect && this.$defaultSelect.tagName === 'SELECT') {
			this.$root = this.$defaultSelect.parentElement;
			this.$defaultOptions = this.$defaultSelect.querySelectorAll('option');

			this.isDropdownActive = false;
			this.settings = {
				class: this.$defaultSelect.classList[0] || this.CLASSNAMES.wrapper,
				placeholder: this.$defaultSelect.dataset.placeholder,
				ariaMessage: this.$defaultSelect.dataset.ariaMessage,
				ariaLabel: this.$defaultSelect.getAttribute('aria-label'),
				beforeChange: null,
				afterChange: null,
				onClick: null,
				onOpen: null,
				onClose: null,
				onInit: null,
			};
			Object.assign(this.settings, userSettings);

			this.init();
		}
	}

	init() {
		if (this.settings.onInit) {
			this.settings.onInit();
		}

		this.defineNodes();
		this.defineHiddenSelect();
		this.defineOptions();
		this.defineDefaultStates();
		this.onHandleTriggerClick();
	}

	copyAttributes($source, $target) {
		for (let key in $source.attributes) {
			if ($source.attributes[key].nodeName) {
				$target.setAttribute($source.attributes[key].nodeName, $source.attributes[key].nodeValue);
			}
		}
	}

	defineNodes() {
		this.$wrapper = document.createElement('div');
		this.$trigger = document.createElement('button');
		if (this.$defaultOptions) {
			this.$list = document.createElement('ul');
			this.$list.classList.add(this.CLASSNAMES.list);
		}

		this.$wrapper.classList.add(this.settings.class);
		this.$trigger.classList.add(this.CLASSNAMES.trigger);

		this.copyAttributes(this.$defaultSelect, this.$wrapper);
		if (!this.settings.ariaLabel) {
			this.$wrapper.setAttribute('aria-label', this.settings.placeholder);
		}
		this.$wrapper.setAttribute('role', 'listbox');

		this.$trigger.setAttribute('type', 'button');;
		this.$trigger.setAttribute('role', 'status');
		this.$trigger.setAttribute('aria-live', 'polite');

		this.$wrapper.append(this.$trigger);
		this.$wrapper.append(this.$list);
		this.$root.append(this.$wrapper);
		this.$defaultSelect.remove(); // remove old select
	}

	defineHiddenSelect() {
		this.$hiddenSelect = document.createElement('select');
		this.$hiddenSelect.classList.add(this.CLASSNAMES.hiddenSelect);
		this.$hiddenOption = document.createElement('option');

		this.$hiddenSelect.append(this.$hiddenOption);
		this.$root.prepend(this.$hiddenSelect);
	}

	defineOptions() {
		if (this.$defaultOptions) {
			this.$defaultOptions.forEach((el, i) => {
				let $listItem = document.createElement('li');
				let $button = document.createElement('button');

				$listItem.classList.add(this.CLASSNAMES.listItem);
				this.copyAttributes(el, $button);
				$button.removeAttribute('data-selected');
				$button.classList.add(this.CLASSNAMES.option);
				$button.textContent = el.textContent;
				$button.setAttribute('role', 'option');
				$button.setAttribute('aria-selected', 'false');

				$button.addEventListener('click', (e) => {
					this.onHandleChange(e);
					this.dropdownClose();
				});

				$listItem.append($button);
				this.$list.append($listItem);

				if (el.dataset.selected && !this.settings.$selectedOption && !this.settings.placeholder) {
					this.setSelected($button);
				}
				else if (i === 0) {
					this.$firstOption = $button;
				}
			});
		}
	}

	setTriggerAria() {
		if (this.$wrapper.dataset.ariaMessage) {
			this.$wrapper.setAttribute('aria-label', this.$wrapper.dataset.ariaMessage + ` ${this.$trigger.textContent}`);
		}
	}

	setValue(value) {
		this.$trigger.textContent = value;
	}

	setSelected($target) {
		if (this.settings.$selectedOption) {
			this.settings.$selectedOption.parentElement.removeAttribute('data-selected');
			this.settings.$selectedOption.removeAttribute('tabindex');
			this.settings.$selectedOption.setAttribute('aria-selected', 'false')
		}

		this.settings.$selectedOption = $target;
		this.settings.$selectedOption.parentElement.dataset.selected = 'true';
		this.settings.$selectedOption.setAttribute('tabindex', '-1');
		this.settings.$selectedOption.setAttribute('aria-selected', 'true')

		this.$hiddenOption.textContent = this.settings.$selectedOption.textContent;
		this.$hiddenOption.setAttribute('value', this.settings.$selectedOption.textContent);

		this.setValue(this.settings.$selectedOption.textContent);
		this.setTriggerAria();
	}

	defineDefaultStates() {
		if (this.settings.placeholder) {
			this.setValue(this.settings.placeholder);
		}
		else if (!this.settings.$selectedOption) {
			this.settings.$selectedOption = this.$firstOption;
			this.setSelected(this.$firstOption);
		}
	}

	dropdownOpen() {
		if (this.settings.onOpen) {
			this.settings.onOpen();
		}
		this.isDropdownActive = true;
		this.$wrapper.dataset.state = 'active';

		window.addEventListener('click', this.onHandleOutsideClick);
	}

	dropdownClose() {
		if (this.settings.onClose) {
			this.settings.onClose();
		}

		this.isDropdownActive = false;
		this.$wrapper.removeAttribute('data-state');

		window.removeEventListener('click', this.onHandleOutsideClick);
	}

	onHandleChange(e) {
		if (this.settings.beforeChange) {
			this.settings.beforeChange();
		}

		this.setSelected(e.target);
		this.$trigger.focus();

		if (this.settings.afterChange) {
			this.settings.afterChange();
		}
	}

	onHandleTriggerClick() {
		this.$trigger.addEventListener('click', () => {
			if (this.settings.onClick) {
				this.settings.onClick();
			}
			if (this.isDropdownActive) {
				this.dropdownClose();
			} else {
				this.dropdownOpen();
			}
		});
	}

	onHandleOutsideClick = (e) => {
		if (this.isDropdownActive && !this.$wrapper.contains(e.target)) {
			this.dropdownClose();
		}
	}
}

