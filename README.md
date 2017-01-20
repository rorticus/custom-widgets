# Dojo 2 Custom Elements

This is an example of one way Dojo 2 widgets can be used with custom elements.

## Usage

```ts
import createFoxWidget from 'fox-widget';
import registerCustomElement from './registerCustomElement';

const FoxWidget = registerCustomElement('fox-widget', createMyWidget);
```

You can then proceed to use `FoxWidget` or `<fox-widget>` like any other custom element.

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

or,

```ts
const foxWidget = new FoxWidget();
foxWidget.setAttribute('label', 'what does the fox say');
document.body.appendChild(foxWidget);
```