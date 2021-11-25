# gelect

A vanilla, lightweight (5kb), configurable select plugin.


Example:

HTML:
<select class="your-element">
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
  <option data-selected='true'>Option 4</option>
  <option>Option 5</option>
</select>

You can add any additional class or attribute to <select> or <option>

First option default selected.
To select a specific option - add data-selected='true' to <option>
If you need add placeholder - add data-placeholder='Placeholder' to <select>

JS:
```js
const mySelect = new gelect('.your-element');

// to setting:
const mySelect = new gelect('.your-element', {
  class: string, // default 'gelect' or classList[0] of your select if defined

  // equals data-attributes:
  placeholder: string,
  ariaMessage: string,
  ariaLabel: string,

  // callBacks
  onInit: () => {},
  onClick: () => {},
  onOpen: () => {},
  onClose: () => {},
  beforeChange: () => {},
  afterChange: () => {},
});
```


Accessebility
For full accessebility - add to <select>:
 - aria-label='*' // *name of select, default value equals placeholder;
 - data-aria-message='*' // *message when option selected;
 example:
  <select aria-label='Select country' data-aria-message='Country selected:'>
    <option>USA</option>
    <option>Russia</option>
  </select>
  if we select Russian, output: 'Country selected: Russia'