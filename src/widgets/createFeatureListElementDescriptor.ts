import FeatureList from './FeatureList';
import { CustomElementDescriptor } from '@dojo/widget-core/customElements';

export default function createFeatureListCustomElement(): CustomElementDescriptor {
	return {
		tagName: 'feature-list',
		widgetConstructor: FeatureList,
		attributes: [
			{
				attributeName: 'limit',
				value(value: string | null): number {
					return parseInt(value || '0', 10);
				}
			}
		],
		properties: [
			{
				propertyName: 'expanded'
			}
		]
	};
};
