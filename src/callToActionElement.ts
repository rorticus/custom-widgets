import registerCustomElement from './registerCustomElement';
import createCallToAction from './widgets/createCallToAction';

registerCustomElement('call-to-action', createCallToAction, {
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
});
