import { registerCustomElementV0 } from './registerCustomElement';
import createFeatureList from './widgets/createFeatureList';

registerCustomElementV0('feature-list', createFeatureList, {
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
});
