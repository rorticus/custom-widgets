# Dojo 2 Custom Elements

This is an example of one way Dojo 2 widgets can be used with custom elements.

## Usage

```ts
import createFoxWidget from 'fox-widget';
import registerCustomElement from './registerCustomElement';

registerCustomElement('fox-widget', createMyWidget, {
    attributes: [
        {
            attributeName: 'label'
        }
    ],
    events: [
        {
            propertyName: 'onFoxNoise',
            name: 'fox-noise'
        }
    ]
});
```

You can then proceed to use `<fox-widget>` like any other custom element.

```html
<div>
    <fox-widget label="what does the fox say"></fox-widget>
</div>
```

or,

```ts
const foxWidget = document.createElement('fox-widget');
foxWidget.setAttribute('label', 'what does the fox say');
```

### Attributes

You can explicitly map widget properties to DOM node attributes with the `attributes` array.

```ts
registerCustomElement('fox-widget', createMyWidget, {
    attributes: [
        {
            attributeName: 'label'
        },
        {
            attributeName: 'species',
            propertyName: 'foxSpecies'
        },
        {
            attributeName: 'some-number',
            propertyName: 'someNumber',
            value: value => Number(value || 0)
        }
    ]
});
```

`attributeName` refers to the attribute that will set on the DOM element, so, `<fox-widget label="test">`.
`propertyName` refers to the property on the widget to set, and if not set, defaults to the `attributeName`.
You can also specify a transformation function on the attribute value. This function should return the value that
will be set on the widget's property.

### Properties

### Events