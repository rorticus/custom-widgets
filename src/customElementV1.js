import { initializeElement, handleAttributeChanged } from './registerCustomElement';

export class CustomElement extends HTMLElement {
    getWidgetFactory() {
    }

    getDescriptor() {
    }

    constructor() {
        super();

        initializeElement(this);
    }

    getWidgetInstance() {
        return this.instance;
    }

    setWidgetInstance(instance) {
        this.instance = instance;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        handleAttributeChanged(this, name, newValue, oldValue);
    }
}

export default function registerCustomElementV1(tagName, widget, descriptor = {}) {
    customElements.define(tagName, class extends CustomElement {
        static get observedAttributes() {
            return (descriptor.attributes || []).map((attribute) => {
                return attribute.attributeName;
            });
        }

        getDescriptor() {
            return descriptor;
        }

        getWidgetFactory() {
            return widget;
        }
    });
}
