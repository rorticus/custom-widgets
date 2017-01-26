import registerCustomElement from './registerCustomElement';
import createSideBySide, { SideBySideEntry } from './widgets/createSideBySide';

registerCustomElement('side-by-side', createSideBySide, {
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

		properties['options'] = options;
	}
});
