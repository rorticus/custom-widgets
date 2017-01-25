import { WidgetFactory, DNode, WidgetProperties, Widget } from '@dojo/widget-core/interfaces';
import createProjector from '@dojo/widget-core/createProjector';
import { w } from '@dojo/widget-core/d';
import { Projector } from '@dojo/widget-core/mixins/createProjectorMixin';
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
	(this: CustomElement): void;
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
	projector: Projector;
	descriptor: CustomElementDescriptor;
	properties: WidgetProperties;

	createdCallback() {
		const self = this;
		this.properties = {};

		const { attributes = [], events = [], properties = [], initialization } = this.descriptor;

		attributes.forEach(attribute => {
			const attributeName = attribute.attributeName;

			const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(attributeName, self.getAttribute(attributeName), attribute);
			this.properties[ propertyName ] = propertyValue;
		});

		let customProperties: PropertyDescriptorMap = {};

		attributes.reduce((properties, attribute) => {
			const { propertyName = attribute.attributeName } = attribute;

			properties[ propertyName ] = {
				get() {
					return self.properties[ propertyName ];
				},
				set(value: any) {
					const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(attribute.attributeName, value, attribute);
					self.properties[ propertyName ] = propertyValue;
					projector.invalidate();
				}
			};

			return properties;
		}, customProperties);

		properties.reduce((properties, property) => {
			const { propertyName, getValue, setValue } = property;
			const { widgetPropertyName = propertyName } = property;

			properties[ propertyName ] = {
				get() {
					const value = self.properties[ widgetPropertyName ];
					return getValue ? getValue(value) : value;
				},

				set(value: any) {
					self.properties[ widgetPropertyName ] = setValue ? setValue(value) : value;
					projector.invalidate();
				}
			};

			return properties;
		}, customProperties);

		Object.defineProperties(this, customProperties);

		// define events
		events.forEach((event) => {
			const { propertyName, eventName } = event;

			self.properties[ propertyName ] = (event: any) => {
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
			initialization.call(this);
		}

		Array.prototype.slice.call(this.children, 0).forEach((childNode: HTMLElement) => {
			this.removeChild(childNode);
		});

		const mixedWidget = self.widget.mixin({
			initialize(instance: any) {
				instance.own(instance.on('properties:changed', self.onPropertiesChanged.bind(self)));
			}
		});

		const projector = createProjector.mixin({
			mixin: {
				getNode(): DNode {
					return w(mixedWidget, self.properties, children);
				}
			}
		})({
			root: this
		});

		projector.append();
		this.projector = projector;
	}

	onPropertiesChanged(event: any) {
		event.changedPropertyKeys.forEach((key: string) => {
			this.properties[key] = event.properties[key];
		});
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		(this.descriptor.attributes || []).forEach((attribute) => {
			if (attribute.attributeName === name) {
				const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(name, newValue, attribute);
				this.properties[ propertyName ] = propertyValue;
			}
		});

		this.projector.invalidate();
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
