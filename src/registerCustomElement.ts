import { Widget, WidgetFactory } from '@dojo/widget-core/interfaces';
import { initializeElement, CustomElementDescriptor, handleAttributeChanged } from '@dojo/widget-core/customElements';

declare namespace document {
	function registerElement(name: string, constructor: any): Function;
}

declare namespace customElements {
	function define(name: string, constructor: any): void;
}

export interface CustomElementDescriptorFactory {
	(): CustomElementDescriptor;
}

abstract class CustomElementV1 extends HTMLElement {
	widgetInstance: Widget<any>;

	constructor() {
		super();

		initializeElement(this);
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		handleAttributeChanged(this, name, newValue, oldValue);
	}

	getWidgetInstance(): Widget<any> {
		return this.widgetInstance;
	}

	setWidgetInstance(widget: Widget<any>): void {
		this.widgetInstance = widget;
	}

	getWidgetFactory(): WidgetFactory<any, any> {
		return this.getDescriptor().widgetFactory;
	}

	getDescriptor(): CustomElementDescriptor {
		return this.getDescriptor();
	}
}

export function registerCustomElementV1(descriptorFactory: CustomElementDescriptorFactory) {
	const descriptor = descriptorFactory();

	customElements.define(descriptor.tagName, class extends CustomElementV1 {
		getDescriptor() {
			return descriptor;
		}
	});
}

export function registerCustomElementV0(descriptorFactory: CustomElementDescriptorFactory) {
	let widgetInstance: any = null;

	const descriptor = descriptorFactory();
	const { tagName, widgetFactory } = descriptor;

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
					return widgetFactory;
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
