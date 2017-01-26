import { WidgetFactory, Widget } from '@dojo/widget-core/interfaces';
import { initializeElement, CustomElementDescriptor, handleAttributeChanged } from './customElements';

declare namespace document {
	function registerElement(name: string, constructor: any): Function;
}

declare namespace customElements {
	function define(name: string, constructor: any): void;
}

export abstract class CustomElement extends HTMLElement {
	instance: Widget<any>;

	abstract getWidgetFactory(): WidgetFactory<any, any>;

	abstract getDescriptor(): CustomElementDescriptor;

	constructor() {
		super();

		initializeElement<any, any>(this);
	}

	getWidgetInstance() {
		return this.instance;
	}

	setWidgetInstance(instance: Widget<any>) {
		this.instance = instance;
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		handleAttributeChanged(this, name, newValue, oldValue);
	}
}

export function registerCustomElementV1(tagName: string, widget: any, descriptor: CustomElementDescriptor = {}) {
	customElements.define(tagName, class extends CustomElement {

		getWidgetFactory(): WidgetFactory<any, any> {
			return widget;
		}

		getDescriptor(): CustomElementDescriptor {
			return descriptor;
		}
	});
}

export function registerCustomElementV0(tagName: string, widget: any, descriptor: CustomElementDescriptor = {}) {
	let widgetInstance: any = null;

	return document.registerElement(tagName, {
		prototype: Object.create(HTMLElement.prototype, {
			createdCallback: {
				value: function (this: HTMLElement) {
					initializeElement(<any> this);
				}
			},

			attributeChangedCallback: {
				value: function (this: HTMLElement, name: string, oldValue: string, newValue: string) {
					handleAttributeChanged(<any> this, name, newValue, oldValue);
				}
			},

			getWidgetFactory: {
				value: function () {
					return widget;
				}
			},

			getDescriptor: {
				value: function () {
					return descriptor;
				}
			},

			getWidgetInstance: {
				value: function () {
					return widgetInstance;
				}
			},

			setWidgetInstance: {
				value: function (instance: any) {
					widgetInstance = instance;
				}
			}
		})
	});
}


export default registerCustomElementV1;