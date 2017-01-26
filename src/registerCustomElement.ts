import { initializeElement, CustomElementDescriptor, handleAttributeChanged } from './customElements';
import registerCustomElementV1 from './customElementV1';

declare namespace document {
	function registerElement(name: string, constructor: any): Function;
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