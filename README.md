# gelect

A vanilla, lightweight (10kb), easy-configurable plugin for select.


## Instalation:
1. Run `npm install gelect`
2. use `import Gelect from 'gelect';`
2. use `import 'gelect/gelect.scss';`, or copy contents to your scss if you want change styles


## HTML:
**Note:** You can add any additional class or attributes to `<select>` or `<option>`

```html
<select class="your-element">
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
  <option data-selected='true'>Option 4</option>
  <option>Option 5</option>
</select>
```

First option default selected.

To select a specific option - add `data-selected='true'` to `<option>`.

If you need add placeholder - add `data-placeholder='Placeholder'` to `<select>`

## JS:
```js
const selects = document.querySelectorAll('.your-element');
selects.forEach((select) => {
  const newSelect = new Gelect(select, {
    // class: string, // default 'gelect' or classList[0] of your select (if defined)

    placeholder: string, // or data-placeholder='' to select
    selected: index or node, // or data-selected='' to option
    ariaMessage: string, // or data-aria-message='' to select - (voice alert when option selected, example - Selected country:)
    ariaLabel: '', // or aria-label='' to select
    search: { // object or boolean -  or data-search='true' to select
    	placeholder: '', // or data-search-placeholder='Search...' to select
    },

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
```

## Accessebility:
For full accessebility - add to `<select>`:
 - `aria-label='*'` // *name of select, default value equals placeholder;
 - `data-aria-message='*'` // *message when option selected;
 example:
  ```html
  <select aria-label='Select language' data-aria-message='Language selected:'>
    <option>English</option>
    <option>Russian</option>
  </select>
  if we select Russian, output: 'Language selected: Russian'
  ```
