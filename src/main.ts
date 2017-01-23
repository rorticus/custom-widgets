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

document.getElementsByTagName('call-to-action')[0].addEventListener('button-click', function(e) {
	alert('i am clicked!');
	e.stopPropagation();
});
