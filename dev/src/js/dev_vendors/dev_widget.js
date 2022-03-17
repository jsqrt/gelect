/* eslint-disable no-plusplus */
const getAllClasses = (context, output) => {
	if (output.length) {
		const finalArray = [];
		const mainArray = [];
		const allElements = $(context).find($('*')); // get all elements of our page
		// If element has class push this class to mainArray
		for (let i = 0; i < allElements.length; i++) {
			const someElement = allElements[i];
			const elementClass = someElement.className;
			if (elementClass.length > 0) {
				// if element have not empty class
				// If element have multiple classes - separate them
				const elementClassArray = elementClass.split(' ');
				const classesAmount = elementClassArray.length;
				if (classesAmount === 1) {
					mainArray.push(`.${elementClassArray[0]} {`);
				} else {
					let cascad = `.${elementClassArray[0]} {`;
					for (let j = 1; j < elementClassArray.length; j++) {
						cascad += ` &.${elementClassArray[j]} { }`;
					}
					mainArray.push(cascad);
				}
			}
		}

		// creating finalArray, that don't have repeating elements
		const unique = (A) => {
			const n = A.length;
			let k = 0;
			const B = [];
			for (let i = 0; i < n; i++) {
				let j = 0;
				while (j < k && B[j] !== A[i]) j++;
				if (j === k) B[k++] = A[i];
			}
			return B;
		};

		const noRepeatingArray = unique(mainArray);

		noRepeatingArray.forEach((item) => {
			let has = false;
			const preWords = item.split('&');
			for (let i = 0; i < finalArray.length; ++i) {
				const newWords = finalArray[i].split('&');
				if (newWords[0] === preWords[0]) {
					has = true;
					for (let j = 0; j < preWords.length; ++j) {
						if (newWords.indexOf(preWords[j]) < 0) {
							newWords.push(preWords[j]);
						}
					}
					finalArray[i] = newWords.join('&');
				}
			}
			if (!has) {
				finalArray.push(item);
			}
		});
		for (let i = 0; i < finalArray.length; i++) {
			$(`<div>${finalArray[i]} }</div>`).appendTo(output);
		}
	}
};

const pageWidget = (pages) => {
	const widgetWrap = $(
		`<div class="widget_wrap">
      <ul class="widget_list"></ul>
    </div>`,
	);
	widgetWrap.prependTo('body');
	for (let i = 0; i < pages.length; i++) {
		$(
			`<li class="widget_item">
        <a class="widget_link" href="${pages[i]}.html">${pages[i]}</a>
      </li>`,
		).appendTo('.widget_list');
	}
	const widgetStilization = $(
		'<style>body {position:relative} .widget_wrap{position:absolute;top:100px;left:0;z-index:9999;padding:10px 20px;background:#222;-webkit-transition:all .3s ease;transition:all .3s ease;-webkit-transform:translate(-100%,0);-ms-transform:translate(-100%,0);transform:translate(-100%,0)}.widget_wrap:after{content:"Navigation menu";color:white;position:absolute;top:0;left:100%;width:auto;height:auto;padding:10px;text-transform:uppercase;background:#222;cursor:pointer}.widget_wrap:hover,.widget_wrap:active,.widget_wrap:focus{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.widget_item{padding:0 0 10px}.widget_link{color:#fff;text-decoration:none;font-size:15px;}.widget_link:hover{text-decoration:underline}  </style>',
	);
	widgetStilization.prependTo('.widget_wrap');
};

const pageWidgetArray = [];

const pagesArray = PAGES;

const pageWidgetInit = () => {
	if (typeof pagesArray !== 'undefined' && pagesArray.length > 0) {
		console.log('dev functions loaded');

		getAllClasses('html', '.elements_list');

		pagesArray.forEach((page) => {
			const pageName = page.split('.').slice(0, -1).join('.');
			pageWidgetArray.push(pageName);
		});

		// console.log(pageWidgetArray);
		pageWidget(pageWidgetArray);
	}
};

export default pageWidgetInit;
