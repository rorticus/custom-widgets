import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import * as styles from './styles/callToAction.css';
import {WidgetBase} from '@dojo/widget-core/WidgetBase';
import {WidgetProperties} from '@dojo/widget-core/interfaces';

export interface CallToActionProperties extends WidgetProperties {
	label?: string;
	style?: 'blue' | 'green';
	onClick?: (event?: MouseEvent) => void;
}

@theme(styles)
export default class CallToAction extends ThemeableMixin(WidgetBase)<CallToActionProperties> {
	onClick(event?: MouseEvent) {
		this.properties.onClick && this.properties.onClick.call(this, event);
	}

	render() {
		const { onClick: onclick } = this;

		let classes = [ styles.callToActionContainer ];

		if (this.properties.style === 'green') {
			classes.push(styles.greenStyle);
		}

		return v('button', {
			onclick,
			classes: this.classes(...classes)
		}, [
			v('label', [ this.properties.label || '' ])
		]);
	}
}
