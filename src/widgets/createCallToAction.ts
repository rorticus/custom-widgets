import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { DNode, Widget } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { VNodeProperties } from '@dojo/interfaces/vdom';
import * as styles from './styles/callToAction.css';
import { toggleThemeClasses } from '../util';

export interface CallToActionProperties {
	label?: string;
	style?: 'blue' | 'green';
	onClick?: (event?: MouseEvent) => void;
}

export type CallToActionWidget = Widget<CallToActionProperties> & Themeable<typeof styles> & {
	onClick: (event?: MouseEvent) => void;
};

export default createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseTheme: styles,
		tagName: 'button',
		onClick(this: CallToActionWidget, event?: MouseEvent) {
			this.properties.onClick && this.properties.onClick.call(this, event);
		},

		nodeAttributes: [
			function (this: CallToActionWidget): VNodeProperties {
				const { onClick: onclick } = this;

				return {
					onclick,
					classes: { ...this.theme.callToActionContainer, ...toggleThemeClasses(this.theme.greenStyle, this.properties.style === 'green') }
				};
			}
		],
		getChildrenNodes(this: CallToActionWidget): DNode[] {
			return [
				v('label', [ this.properties.label || '' ])
			];
		}
	}
});
