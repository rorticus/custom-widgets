import registerCustomElement from './registerCustomElement';
import createCallToAction from './widgets/createCallToAction';

registerCustomElement('call-to-action', createCallToAction, {
	attributes: [
		{
			attributeName: 'label'
		}
	],
	events: [
		{
			propertyName: 'onClick',
			eventName: 'button-click'
		}
	]
});
