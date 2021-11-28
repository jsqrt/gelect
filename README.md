# gelect

A vanilla, lightweight (6kb), configurable plugin for select.


## HTML:
**Note:** You can add any additional class or attribute to `<select>` or `<option>`

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
const select = document.querySelector('.your-element');
const mySelect = new Gelect(select, {
  class: string, // default 'gelect' or classList[0] of your select (if defined)

  placeholder: string, // = data-placeholder=''
  selected: index or node, // = data-selected=''
  ariaMessage: string, // = data-aria-message=''
  ariaLabel: string, // = aria-label=''

  // callBacks
  onInit: () => {},
  onClick: () => {},
  onOpen: () => {},
  onClose: () => {},
  beforeChange: () => {},
  afterChange: () => {},
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
