import createCallToActionElementDescriptor from './widgets/createCallToActionElementDescriptor';
import createSideBySideElementDescriptor from './widgets/createSideBySideElementDescriptor';
import createFeatureListElementDescriptor from './widgets/createFeatureListElementDescriptor';
import registerCustomElement from './registerCustomElement';
import createProjector from '@dojo/widget-core/createProjector';
import { DNode } from '@dojo/widget-core/interfaces';
import { w } from '@dojo/widget-core/d';
import createDomWrapper from '@dojo/widget-core/util/createDomWrapper';

registerCustomElement(createCallToActionElementDescriptor);
registerCustomElement(createSideBySideElementDescriptor);
registerCustomElement(createFeatureListElementDescriptor);

registerCustomElement(function () {
	const defaultNode = document.createElement('h2');
	defaultNode.innerHTML = 'hello';

	return {
		tagName: 'dom-wrapper',
		widgetFactory: createProjector.mixin({
			mixin: {
				getChildrenNodes(this: any): DNode[] {
					let { domNode = defaultNode } = this.properties;
					return [
						w(createDomWrapper, { domNode })
					];
				}
			}
		}),
		properties: [
			{
				propertyName: 'domNode'
			}
		]
	};
});