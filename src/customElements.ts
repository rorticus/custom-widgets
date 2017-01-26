import { WidgetFactory, WidgetProperties, Widget, DNode } from '@dojo/widget-core/interfaces';
import createWidget from '@dojo/widget-core/createWidgetBase';
import { VNodeProperties } from '@dojo/interfaces/vdom';
import { w } from '@dojo/widget-core/d';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';


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
	(properties: WidgetProperties): void;
}

export interface CustomElementDescriptor {
	attributes?: CustomElementAttributeDescriptor[];
	properties?: CustomElementPropertyDescriptor[];
	events?: CustomElementEventDescriptor[];
	initialization?: CustomElementInitializer;
}

export interface CustomElement<W extends Widget<P>, P> extends HTMLElement {
	getWidgetFactory(): WidgetFactory<W, P>;
	getDescriptor(): CustomElementDescriptor;
	getWidgetInstance(): W;
	setWidgetInstance(instance: W): void;
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

export function initializeElement<W extends Widget<P>, P extends WidgetProperties>(element: CustomElement<W, P>) {
	let initialProperties: any = {};

	const { attributes = [], events = [], properties = [], initialization } = element.getDescriptor();

	attributes.forEach(attribute => {
		const attributeName = attribute.attributeName;

		const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(attributeName, element.getAttribute(attributeName), attribute);
		initialProperties[ propertyName ] = propertyValue;
	});

	let customProperties: PropertyDescriptorMap = {};

	attributes.reduce((properties, attribute) => {
		const { propertyName = attribute.attributeName } = attribute;

		properties[ propertyName ] = {
			get() {
				return element.getWidgetInstance().properties[ propertyName ];
			},
			set(value: any) {
				const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(attribute.attributeName, value, attribute);
				element.getWidgetInstance().setProperties(Object.assign({}, element.getWidgetInstance().properties, {
					[propertyName]: propertyValue
				}));
			}
		};

		return properties;
	}, customProperties);

	properties.reduce((properties, property) => {
		const { propertyName, getValue, setValue } = property;
		const { widgetPropertyName = propertyName } = property;

		properties[ propertyName ] = {
			get() {
				const value = element.getWidgetInstance().properties[ widgetPropertyName ];
				return getValue ? getValue(value) : value;
			},

			set(value: any) {
				element.getWidgetInstance().setProperties(Object.assign(
					{},
					element.getWidgetInstance().properties,
					{ [widgetPropertyName]: setValue ? setValue(value) : value }
				));
			}
		};

		return properties;
	}, customProperties);

	Object.defineProperties(element, customProperties);

	// define events
	events.forEach((event) => {
		const { propertyName, eventName } = event;

		initialProperties[ propertyName ] = (event: any) => {
			element.dispatchEvent(new CustomEvent(eventName, {
				bubbles: false,
				detail: event
			}));
		};
	});

	// find children
	let children: DNode[] = [];

	Array.prototype.slice.call(element.children, 0).forEach((childNode: HTMLElement, index: number) => {
		children.push(w(createHTMLWrapper, {
			key: `child-${index}`,
			domNode: childNode
		}));
	});

	if (initialization) {
		initialization.call(element, initialProperties);
	}

	Array.prototype.slice.call(element.children, 0).forEach((childNode: HTMLElement) => {
		element.removeChild(childNode);
	});

	const widgetInstance = element.getWidgetFactory().mixin(createProjectorMixin)({
		root: element
	});

	widgetInstance.setProperties(initialProperties);
	widgetInstance.setChildren(children);
	(<any> widgetInstance).append();

	element.setWidgetInstance(widgetInstance);
}

export function handleAttributeChanged<W extends Widget<P>, P extends WidgetProperties>(element: CustomElement<W, P>, name: string, newValue: string | null, oldValue: string | null) {
	(element.getDescriptor().attributes || []).forEach((attribute) => {
		if (attribute.attributeName === name) {
			const [ propertyName, propertyValue ] = getWidgetPropertyFromAttribute(name, newValue, attribute);
			element.getWidgetInstance().setProperties(Object.assign(
				{},
				element.getWidgetInstance().properties,
				{ [propertyName]: propertyValue }
			));
		}
	});
}