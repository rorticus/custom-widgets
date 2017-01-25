import { WidgetFactory, DNode, Widget, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w } from '@dojo/widget-core/d';
import createProjectorMixin, { Projector } from '@dojo/widget-core/mixins/createProjectorMixin';
import createWidget from '@dojo/widget-core/createWidgetBase';
import { VNodeProperties } from '@dojo/interfaces/vdom';

declare namespace document {
	function registerElement(name: string, constructor: any): Function;
}

interface CustomElementAttributeDescriptor {
	attributeName: string;
	propertyName?: string;
	value?: (value: string | null) => any;
}

interface CustomElementPropertyDescriptor {
	propertyName: string;
	widgetPropertyName?: string;
	getValue?: (value: any) => any;
	setValue?: (value: any) => any;
}

interface CustomElementEventDescriptor {
	propertyName: string;
	eventName: string;
}

interface CustomElementInitializer {
	(this: CustomElement, properties: WidgetProperties): void;
}

interface CustomElementDescriptor {
	attributes?: CustomElementAttributeDescriptor[];
	properties?: CustomElementPropertyDescriptor[];
	events?: CustomElementEventDescriptor[];
	initialization?: CustomElementInitializer;
}

function getWidgetPropertyFromAttribute(attributeName: string, attributeValue: string | null, descriptor: CustomElementAttributeDescriptor): [ string, any ] {
	let { propertyName = attributeName, value = attributeValue } = descriptor;

	if (typeof value === 'function') {
		value = value(attributeValue);
	}

	return [ propertyName, value ];
}

interface HTMLWrapperProperties {
	domNode: HTMLElement;
}

type HTMLWrapper = Widget<HTMLWrapperProperties> & {
	afterCreate: (element: Element) => void;
};

export const createHTMLWrapper = createWidget.mixin({
	mixin: {
		afterCreate(this: HTMLWrapper, element: Element) {
			if (this.properties.domNode) {
				element.appendChild(this.properties.domNode);
				// element.parentNode!.replaceChild(this.properties.domNode, element);
			}
		},
		nodeAttributes: [
			function (this: HTMLWrapper): VNodeProperties {
				const { afterCreate } = this;

				return {
					afterCreate
				};
			}
		]
	}
});

export class CustomElement extends HTMLElement {
	widget: WidgetFactory<any, any>;
	instance: Widget<any>;
	projector: Projector;
	descriptor: CustomElementDescriptor;

	createdCallback() {
		const self = this;
		let initialProperties: any = {};

		const { attributes = [], events = [], properties = [], initialization } = this.descriptor;

		attributes.forEach(attribute => {
			const attributeName = attribute.attributeName;

			const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(attributeName, self.getAttribute(attributeName), attribute);
			initialProperties[ propertyName ] = propertyValue;
		});

		let customProperties: PropertyDescriptorMap = {};

		attributes.reduce((properties, attribute) => {
			const { propertyName = attribute.attributeName } = attribute;

			properties[ propertyName ] = {
				get() {
					return self.instance.properties[ propertyName ];
				},
				set(value: any) {
					const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(attribute.attributeName, value, attribute);
					self.instance.setProperties({ ... self.instance.properties, [propertyName]: propertyValue });
				}
			};

			return properties;
		}, customProperties);

		properties.reduce((properties, property) => {
			const { propertyName, getValue, setValue } = property;
			const { widgetPropertyName = propertyName } = property;

			properties[ propertyName ] = {
				get() {
					const value = self.instance.properties[ widgetPropertyName ];
					return getValue ? getValue(value) : value;
				},

				set(value: any) {
					self.instance.setProperties({
						...self.instance.properties,
						[widgetPropertyName]: setValue ? setValue(value) : value
					});
				}
			};

			return properties;
		}, customProperties);

		Object.defineProperties(this, customProperties);

		// define events
		events.forEach((event) => {
			const { propertyName, eventName } = event;

			initialProperties[ propertyName ] = (event: any) => {
				self.dispatchEvent(new CustomEvent(eventName, {
					bubbles: false,
					detail: event
				}));
			};
		});

		// find children
		let children: DNode[] = [];

		Array.prototype.slice.call(this.children, 0).forEach((childNode: HTMLElement, index: number) => {
			children.push(w(createHTMLWrapper, {
				key: `child-${index}`,
				domNode: childNode
			}));
		});

		if (initialization) {
			initialization.call(this, initialProperties);
		}

		Array.prototype.slice.call(this.children, 0).forEach((childNode: HTMLElement) => {
			this.removeChild(childNode);
		});

		const widgetInstance = self.widget.mixin(createProjectorMixin)({
			root: this
		});

		widgetInstance.setProperties(initialProperties);
		widgetInstance.setChildren(children);
		widgetInstance.append();

		this.instance = widgetInstance;
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		(this.descriptor.attributes || []).forEach((attribute) => {
			if (attribute.attributeName === name) {
				const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(name, newValue, attribute);
				this.instance.setProperties({ ... this.instance.properties, [propertyName]: propertyValue });
			}
		});
	}
}

export default function registerCustomElement(tagName: string, widget: any, descriptor: CustomElementDescriptor = {}): Function {
	return document.registerElement(tagName, {
		prototype: Object.create(CustomElement.prototype, {
			widget: { value: widget },
			descriptor: { value: descriptor }
		})
	});
};
