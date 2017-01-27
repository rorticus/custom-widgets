import createSideBySide, { SideBySideEntry } from './createSideBySide';
import { CustomElementDescriptor } from '@dojo/widget-core/customElements';

export default function createSideBySideElementDescriptor(): CustomElementDescriptor {
	return {
		tagName: 'side-by-side',
		widgetFactory: createSideBySide,
		attributes: [
			{
				attributeName: 'selected',
				value(val: string | null) {
					return val !== null ? parseInt(val, 10) : null;
				}
			}
		],
		properties: [
			{
				propertyName: 'options'
			}
		],
		events: [
			{
				propertyName: 'onOptionSelected',
				eventName: 'option-selected'
			}
		],
		initialization(this: any, properties: any) {
			let options: SideBySideEntry[] = [];

			Array.prototype.slice.call(this.getElementsByTagName('option'), 0).forEach((element: HTMLElement) => {
				options.push({
					price: element.getAttribute('price')!,
					label: element.getAttribute('label')!,
					description: element.innerHTML
				});

				element.parentNode!.removeChild(element);
			});

			properties[ 'options' ] = options;
		}
	};
};
