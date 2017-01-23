import registerCustomElement from '../../../src/registerCustomElement';
import createCallToAction from '../../../src/widgets/createCallToAction';

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
