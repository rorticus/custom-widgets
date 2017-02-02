import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { Widget } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import * as styles from './styles/callToAction.css';

export interface CallToActionProperties {
	label?: string;
	style?: 'blue' | 'green';
	onClick?: (event?: MouseEvent) => void;
}

export type CallToActionWidget = Widget<CallToActionProperties> & Themeable & {
	onClick: (event?: MouseEvent) => void;
};

export default createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: styles,
		onClick(this: CallToActionWidget, event?: MouseEvent) {
			this.properties.onClick && this.properties.onClick.call(this, event);
		}
	}
}).aspect({
	after: {
		render(this: CallToActionWidget) {
			const { onClick: onclick } = this;

			let classes = [ styles.callToActionContainer ];

			if (this.properties.style === 'green') {
				classes.push(styles.greenStyle);
			}

			return v('button', {
				onclick,
				classes: this.classes(...classes).get()
			}, [
				v('label', [ this.properties.label || '' ])
			]);
		}
	}
});
