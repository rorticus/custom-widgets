import createWidgetBase from '@dojo/widgets/createWidgetBase';
import themeable, { Themeable } from '@dojo/widgets/mixins/themeable';
import { DNode, Widget } from '@dojo/widgets/interfaces';
import { v } from '@dojo/widgets/d';
import { VNodeProperties } from '@dojo/interfaces/vdom';
import * as styles from './styles/callToAction.css';

export interface CallToActionProperties {
	label?: string;
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
					classes: this.theme.callToActionContainer
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
