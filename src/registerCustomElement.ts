import { WidgetFactory, DNode, WidgetProperties } from '@dojo/widgets/interfaces';
import createProjector from '@dojo/widgets/createProjector';
import { w } from '@dojo/widgets/d';
import { Projector } from '@dojo/widgets/mixins/createProjectorMixin';

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
}

interface CustomElementEventDescriptor {
	propertyName: string;
	eventName: string;
}

interface CustomElementDescriptor {
	attributes?: CustomElementAttributeDescriptor[];
	properties?: CustomElementPropertyDescriptor[];
	events?: CustomElementEventDescriptor[];
}

function getWidgetPropertyFromAttribute(attributeName: string, attributeValue: string | null, descriptor: CustomElementAttributeDescriptor): [ string, any ] {
	let { propertyName = attributeName, value = attributeValue } = descriptor;

	if (typeof value === 'function') {
		value = value(attributeValue);
	}

	return [ propertyName, value ];
}

export class CustomElement extends HTMLElement {
	widget: WidgetFactory<any, any>;
	projector: Projector;
	descriptor: CustomElementDescriptor;
	properties: WidgetProperties;

	createdCallback() {
		const self = this;
		this.properties = {};

		const { attributes = [], events = [], properties = [] } = this.descriptor;

		attributes.forEach(attribute => {
			const attributeName = attribute.attributeName;

			const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(attributeName, self.getAttribute(attributeName), attribute);
			this.properties[ propertyName ] = propertyValue;
		});

		Object.defineProperties(this, attributes.reduce((properties: PropertyDescriptorMap, attribute) => {
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
		}, {}));

		Object.defineProperties(this, properties.reduce((properties: PropertyDescriptorMap, property) => {
			const { propertyName } = property;

			properties[ propertyName ] = {
				get() {
					return properties[ propertyName ];
				},

				set(value: any) {
					properties[ propertyName ] = value;
					projector.invalidate();
				}
			};

			return properties;
		}, {}));

		// define events
		events.forEach((event) => {
			const { propertyName, eventName } = event;

			self.properties[ propertyName ] = (event: any) => {
				event.stopImmediatePropagation();
				self.dispatchEvent(new CustomEvent(eventName, {
					detail: event
				}));
			};
		});

		const projector = createProjector.mixin({
			mixin: {
				getNode(): DNode {
					return w(self.widget, self.properties);
				}
			}
		})({
			root: this
		});

		projector.append();
		this.projector = projector;
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
