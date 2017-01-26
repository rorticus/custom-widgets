import { WidgetFactory, Widget } from '@dojo/widget-core/interfaces';
import { initializeElement, CustomElementDescriptor, handleAttributeChanged, CustomElement } from './customElements';

declare namespace document {
	function registerElement(name: string, constructor: any): Function;
}

declare namespace customElements {
	function define(name: string, constructor: any): void;
}

export function registerCustomElementV1(tagName: string, widget: any, descriptor: CustomElementDescriptor = {}) {
	let widgetInstance: Widget<any>;

	function CustomElement(this: HTMLElement) {
		let self = HTMLElement.constructor.call(this);
		initializeElement<any, any>(<any> this);
		return self;
	}

	CustomElement.prototype = Object.create(HTMLElement.prototype, {
		constructor: { value: CustomElement },
		getWidgetFactory: {
			value: () => {
				return widget;
			}
		},
		getDescriptor: {
			value: () => {
				return descriptor;
			}
		},
		getWidgetInstance: {
			value: () => {
				return widgetInstance;
			}
		},
		setWidgetInstance: {
			value: (widget: Widget<any>) => {
				widgetInstance = widget;
			}
		},
		attributeChangedCallback: {
			value: function (this: any, name: string, oldValue: string | null, newValue: string | null) {
				handleAttributeChanged(this, name, newValue, oldValue);
			}
		}
	});

	customElements.define(tagName, CustomElement);
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


export default registerCustomElementV0;