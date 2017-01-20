import createWidgetBase from '@dojo/widgets/createWidgetBase';
import { DNode, Widget } from '@dojo/widgets/interfaces';
import { v } from '@dojo/widgets/d';
import { VNodeProperties } from '@dojo/interfaces/vdom';

export interface CallToActionProperties {
	label?: string;
	onClick?: (event?: MouseEvent) => void;
}

export type CallToActionWidget = Widget<CallToActionProperties> & {
	onClick: (event?: MouseEvent) => void;
};

export default createWidgetBase.mixin({
	mixin: {
		classes: [ 'call-to-action' ],
		tagName: 'button',
		onClick(this: CallToActionWidget, event?: MouseEvent) {
			this.properties.onClick && this.properties.onClick.call(this, event);
		},

		nodeAttributes: [
			function (this: CallToActionWidget): VNodeProperties {
				const { onClick: onclick } = this;

				return {
					onclick
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
