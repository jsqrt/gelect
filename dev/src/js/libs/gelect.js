class Gelect {
	get CLASSNAMES() {
		this.wrapper = 'gelect';
		this.trigger = `${this.settings.class}_selected`;
		this.dropdown = `${this.settings.class}_dropdown`;
		this.searchField = `${this.settings.class}_search_wrap`;
		this.searchClose = `${this.settings.class}_search_close`;
		this.search = `${this.settings.class}_search`;
		this.list = `${this.settings.class}_options`;
		this.listItem = `${this.list}__item`;
		this.option = `${this.list}__btn`;

		this.hiddenSelect = `${this.settings.class}_hidden`;

		return this;
	}

	constructor($select, userSettings) {
		this.$defaultSelect = $select;

		if (this.$defaultSelect && this.$defaultSelect.tagName === 'SELECT') {
			this.$root = this.$defaultSelect.parentElement;
			this.$defaultOptions = this.$defaultSelect.querySelectorAll('option');
			this.$options = [];

			this.isDropdownActive = false;
			this.settings = {
				class: this.$defaultSelect.classList[0] || this.CLASSNAMES.wrapper,
				placeholder: this.$defaultSelect.dataset.placeholder,
				search: this.$defaultSelect.dataset.search,
				ariaMessage: this.$defaultSelect.dataset.ariaMessage,
				ariaLabel: this.$defaultSelect.getAttribute('aria-label'),
				beforeChange: null,
				afterChange: null,
				onClick: null,
				onOpen: null,
				onClose: null,
				onInit: null,
				onSearch: null,
			};

			Object.assign(this.settings, userSettings);

			this.init();
		}
	}

	init() {
		this.defineNodes();
		this.defineOptions();
		this.defineDefaultStates();
		this.initEvents();

		if (this.settings.onInit) {
			this.settings.onInit(this);
		}
	}

	copyAttributes($source, $target, exception = []) {
		Object.keys($source.attributes).forEach((key) => {
			if ($source.attributes[key].nodeName) {
				if (!exception.includes($source.attributes[key].nodeName)) {
					$target.setAttribute($source.attributes[key].nodeName, $source.attributes[key].nodeValue);
				}
			}
		});
	}

	defineNodes() {
		this.wrapperInit();
		this.triggerInit();
		this.hiddenSelectInit();
		this.dropdownInit();

		if (this.$defaultOptions) {
			this.listInit();
			this.$dropdown.append(this.$list);
		}
		if (this.settings.search) {
			this.$dropdown.prepend(this.separateSearchInit());
		}

		this.$wrapper.append(this.$trigger);
		this.$wrapper.append(this.$dropdown);
		this.$wrapper.prepend(this.$hiddenSelect);
		this.$root.append(this.$wrapper);

		this.$defaultSelect.remove(); // remove old select
	}

	wrapperInit() {
		this.$wrapper = document.createElement('div');
		this.$wrapper.classList.add(this.settings.class);
		this.$wrapper.dataset.state = 'hidden';
		this.$wrapper.setAttribute('role', 'listbox');

		this.copyAttributes(this.$defaultSelect, this.$wrapper, ['name', 'required', 'id']);
		if (!this.settings.ariaLabel && this.settings.placeholder) {
			this.$wrapper.setAttribute('aria-label', this.settings.placeholder);
		} else if (this.settings.ariaLabel) {
			this.$wrapper.setAttribute('aria-label', this.settings.ariaLabel);
		}
	}

	triggerInit() {
		this.$trigger = document.createElement('button');
		this.$trigger.classList.add(this.CLASSNAMES.trigger);
		this.$trigger.setAttribute('type', 'button');
		this.$trigger.setAttribute('role', 'status');
		this.$trigger.setAttribute('aria-live', 'polite');
	}

	dropdownInit() {
		this.$dropdown = document.createElement('div');
		this.$dropdown.classList.add(this.CLASSNAMES.dropdown);
	}

	listInit() {
		this.$list = document.createElement('ul');
		this.$list.classList.add(this.CLASSNAMES.list);
	}

	separateSearchInit() {
		this.$searchField = document.createElement('div');
		this.$searchField.classList.add(this.CLASSNAMES.searchField);

		this.$search = document.createElement('input');
		this.$search.classList.add(this.CLASSNAMES.search);
		this.$search.setAttribute('type', 'search');
		this.$search.setAttribute('placeholder', 'search');
		this.$search.setAttribute(
			'placeholder',
			this.settings.search.placeholder
			|| this.$defaultSelect.dataset.searchPlaceholder
			|| 'Search...',
		);

		this.$searchClose = document.createElement('button');
		this.$searchClose.classList.add(this.CLASSNAMES.searchClose);
		this.$searchClose.setAttribute('type', 'button');
		this.$searchClose.setAttribute('aria-label', 'Сlear the field');
		this.$searchClose.setAttribute('tabindex', '-1');
		this.$searchClose.setAttribute('aria-hidden', 'true');

		this.$searchField.append(this.$search);
		this.$searchField.append(this.$searchClose);

		return this.$searchField;
	}

	hiddenSelectInit() {
		const selectName = this.$defaultSelect.getAttribute('name');
		const selectRequired = this.$defaultSelect.getAttribute('required');
		this.$hiddenSelect = document.createElement('select');
		this.$hiddenOption = document.createElement('option');

		if (this.$defaultSelect.id) this.$hiddenSelect.setAttribute('id', this.$defaultSelect.id); //!
		if (this.$defaultSelect.name) this.$hiddenSelect.setAttribute('name', this.$defaultSelect.name); //!

		if (selectName) this.$hiddenSelect.setAttribute('name', selectName);
		if (selectRequired) this.$hiddenSelect.setAttribute('required', selectRequired);
		this.$hiddenSelect.classList.add(this.CLASSNAMES.hiddenSelect);

		this.$hiddenSelect.append(this.$hiddenOption);
	}

	defineOptions() {
		if (this.$defaultOptions) {
			this.$defaultOptions.forEach((el, i) => {
				let $listItem = document.createElement('li');
				let $button = document.createElement('button');

				$listItem.classList.add(this.CLASSNAMES.listItem);

				// - Button attributes
				this.copyAttributes(el, $button, ['value']);
				$button.removeAttribute('data-selected');
				$button.classList.add(this.CLASSNAMES.option);
				$button.textContent = el.textContent;
				$button.setAttribute('role', 'option');
				$button.setAttribute('type', 'button');
				$button.setAttribute('aria-selected', 'false');

				const optionAttrValue = el.getAttribute('value') || el.dataset.value;
				if (optionAttrValue) $button.dataset.value = optionAttrValue;
				// - Button attributes###

				$button.addEventListener('click', (e) => {
					this.handleChangeSelected(e);
					this.dropdownClose();
				});

				$listItem.append($button);
				this.$list.append($listItem);
				this.$options.push($button);

				if (this.settings.selected && (el === this.settings.selected || i === this.settings.selected)) {
					this.setSelected($button);
				} else {
					if (
						el.dataset.selected
						&& !this.settings.$selectedOption
						&& !this.settings.placeholder
					) {
						this.setSelected($button);
					} else if (
						i === 0
					) {
						this.$firstOption = $button;
					}
				}
			});
		}
	}

	setTriggerAria() {
		if (this.$wrapper.dataset.ariaMessage) {
			this.$wrapper.setAttribute('aria-label', `${this.$wrapper.dataset.ariaMessage} ${this.$trigger.textContent}`);
		}
	}

	setValue(value) {
		this.$trigger.textContent = value;
	}

	setSelected($target) {
		if (this.settings.$selectedOption) {
			this.settings.$selectedOption.parentElement.removeAttribute('data-selected');
			this.settings.$selectedOption.removeAttribute('tabindex');
			this.settings.$selectedOption.setAttribute('aria-selected', 'false');
		}

		this.settings.$selectedOption = $target;
		this.settings.$selectedOption.parentElement.dataset.selected = 'true';
		this.settings.$selectedOption.setAttribute('tabindex', '-1');
		this.settings.$selectedOption.setAttribute('aria-selected', 'true');

		const optionAttrValue = $target.dataset.value || this.settings.$selectedOption.textContent;
		this.$hiddenOption.textContent = this.settings.$selectedOption.textContent;
		this.$hiddenOption.setAttribute('value', optionAttrValue);

		this.setValue(this.settings.$selectedOption.textContent);
		this.setTriggerAria();
	}

	defineDefaultStates() {
		if (
			this.settings.placeholder
		) {
			this.setValue(this.settings.placeholder);
		} else if (
			!this.settings.$selectedOption
		) {
			this.settings.$selectedOption = this.$firstOption;
			this.setSelected(this.$firstOption);
		}

		if (this.isDropdownActive) {
			this.dropdownOpen();
		}

		if (this.$search) {
			this.searchingState = false;
		}
	}

	initEvents() {
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.onHandleTriggerClick();

		if (this.$search) {
			this.handleSearch = this.handleSearch.bind(this);
			this.clearSearch = this.clearSearch.bind(this);
		}
	}

	dropdownOpen() {
		if (this.settings.onOpen) {
			this.settings.onOpen(this);
		}
		this.isDropdownActive = true;
		this.$wrapper.dataset.state = 'active';

		window.addEventListener('click', this.handleOutsideClick);

		if (this.$search) {
			this.$search.addEventListener('input', this.handleSearch);
			this.$searchClose.addEventListener('click', this.clearSearch);
		}
	}

	dropdownClose() {
		if (this.settings.onClose) {
			this.settings.onClose(this);
		}

		this.isDropdownActive = false;
		this.$wrapper.dataset.state = 'hidden';

		window.removeEventListener('click', this.handleOutsideClick);

		if (this.$search) {
			this.clearSearch();
			this.$search.removeEventListener('input', this.handleSearch);
			this.$searchClose.removeEventListener('click', this.clearSearch);
		}
	}

	handleChangeSelected(e) {
		if (this.settings.beforeChange) {
			this.settings.beforeChange(this);
		}

		this.setSelected(e.target);
		this.$trigger.focus();

		if (this.$search) {
			this.clearSearch();
		}

		if (this.settings.afterChange) {
			this.settings.afterChange(this);
		}
	}

	onHandleTriggerClick() {
		this.$trigger.addEventListener('click', () => {
			if (this.settings.onClick) {
				this.settings.onClick(this);
			}
			if (this.isDropdownActive) {
				this.dropdownClose();
			} else {
				this.dropdownOpen();
			}
		});
	}

	handleOutsideClick(e) {
		if (
			this.isDropdownActive
			&& !this.$wrapper.contains(e.target)
		) {
			this.dropdownClose();
		}
	}

	clearSearch() {
		if (this.searchingState) {
			this.searchingState = false;
			this.$wrapper.removeAttribute('data-searching');
			this.$searchClose.setAttribute('aria-hidden', 'true');
			this.$searchClose.setAttribute('tabindex', '-1');
			this.$search.value = '';

			this.$options.forEach((option) => {
				const $option = option;
				$option.style.display = 'block';
			});
		}
	}

	handleSearch(e) {
		let { value } = e.target;

		if (this.settings.onSearch) {
			this.settings.onSearch(e, this);
		}

		if (value !== '') {
			this.searchingState = true;
			this.$wrapper.setAttribute('data-searching', 'true');
			this.$searchClose.removeAttribute('aria-hidden');
			this.$searchClose.removeAttribute('tabindex');

			this.$options.forEach((option) => {
				const $option = option;
				if (
					!option
						.textContent
						.toLowerCase()
						.includes(value.toLowerCase())
				) {
					$option.style.display = 'none';
				} else {
					$option.style.display = 'block';
				}
			});
		} else {
			this.clearSearch();
		}
	}
}

export default Gelect;
