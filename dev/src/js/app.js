// ------------------- imports
import $ from 'jquery';
import { GLOBAL_VARS } from 'utils/constants';
import { documentReady, pageLoad } from 'utils';
import Gelect from 'gelect';
import 'gelect/gelect.scss';
import pageWidgetInit from './dev_vendors/dev_widget';
// ------------------- imports###

// ------------------  import components
// ------------------  import components###

window.jQuery = $;
window.$ = $;

const styles = ['color: #fff', 'background: #cf8e1f'].join(';');
const message = 'Developed by Glivera-team https://glivera-team.com/';
// eslint-disable-next-line no-console
console.info('%c%s', styles, message);

// -------------------  dev widget
if (GLOBAL_VARS.projectDevStatus) {
	pageWidgetInit();
	console.log(process.env.NODE_ENV);
}
// -------------------  dev widget###

// -------------------  global variables

const readyFunc = () => {
	console.log('ready');

	const selects = document.querySelectorAll('.your-element');
	selects.forEach((select) => {
		const newSelect = new Gelect(select, {
			// class: string, // default 'gelect' or classList[0] of your select (if defined)
			// placeholder: string, // = data-placeholder=''
			// selected: 2, // = data-selected=''
			// ariaMessage: string, // = data-aria-message='' - voice alert when option selected, example - Selected country:
			// ariaLabel: '', // = aria-label=''
			// search: {
			// 	placeholder: '', // = data-search='true' data-search-placeholder='Search...'
			// },

			// callBacks
			onInit: (gelect) => {},
			onClick: (gelect) => {},
			onOpen: (gelect) => {},
			onClose: (gelect) => {},
			beforeChange: (gelect) => {},
			afterChange: (gelect) => {},
			onSearch: (event, gelect) => {},
		});
	});
};

const loadFunc = () => {
	console.log('page load');
};

documentReady(() => {
	readyFunc();
});

pageLoad(() => {
	loadFunc();
});
