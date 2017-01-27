import createCallToAction from './createCallToAction';
import { CustomElementDescriptor } from '@dojo/widget-core/customElements';

export default function createCallToActionElementDescriptor(): CustomElementDescriptor {
	return {
		tagName: 'call-to-action',
		widgetFactory: createCallToAction,
		attributes: [
			{
				attributeName: 'label'
			}
		],
		properties: [
			{
				propertyName: 'when',
				widgetPropertyName: 'label',
				getValue: (label: string) => {
					if (label.indexOf('Sign Up ') >= 0) {
						return label.substring(label.indexOf('Sign Up ') + 'Sign Up '.length);
					}

					return '';
				},
				setValue: (action: string) => {
					return 'Sign Up ' + action;
				}
			}
		],
		events: [
			{
				propertyName: 'onClick',
				eventName: 'button-click'
			}
		]
	};
}
