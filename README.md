# Dojo 2 Custom Elements

This is an example of one way Dojo 2 widgets can be used with custom elements.

## Usage

```ts
import createFoxWidget from 'fox-widget';
import registerCustomElement from './registerCustomElement';

registerCustomElement('fox-widget', createFoxWidget, {
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
registerCustomElement('fox-widget', createFoxWidget, {
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

* `attributeName` refers to the attribute that will set on the DOM element, so, `<fox-widget label="test">`.
* `propertyName` refers to the property on the widget to set, and if not set, defaults to the `attributeName`.
* `value` lets you specify a transformation function on the attribute value. This function should return the value that
will be set on the widget's property.

Adding an attribute to the element will automatically add a corresponding property to the element as well.

```ts
// as an attribute
foxWidget.setAttribute('label', 'fox');

// as a property
foxWidget.label = 'fox';
```

### Properties

You can map DOM element properties to widget properties,

```ts
registerCustomElement('fox-widget', createFoxWidget, {
    properties: [
        {
            propertyName: 'foxType',
            widgetPropertyName: 'species'
        }
    ]
});

// ...

document.getElementsByTagName('fox-widget')[0].foxType = 'Vulpes vulpes fulvus';
```

* `propertyName` is the name of the property on the DOM element
* `widgetPropertyName` is the name of the property on the widget. If unspecified, `propertyName` is used instead.
* `getValue`, if specified, will be called with the widget's property value as an argument. The returned value is returned as the DOM element property value.
* `setValue`, if specified, is called with the DOM elements property value. The returned value is used for the widget property's value.


### Events

Some widgets have function properties, like events, that need to be exposed to your element. You can use the
`events` array to map widget properties to DOM events.

```ts
registerCustomElement('fox-widget', createFoxWidget, {
    events: [
        {
            propertyName: 'onFoxNoise',
            eventName: 'fox-noise'
        }
    ]
});
```

This will add a property to `onFoxNoise` that will emit the `fox-noise` custom event. You can listen like any other
DOM event,

```ts
document.getElementsByTagName('fox-widget')[0].addEventListener('fox-noise', function (event) {
    // do something
});
```
