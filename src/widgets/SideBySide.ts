import {WidgetProperties} from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import * as styles from './styles/sideBySide.css';
import CallToAction from './CallToAction';
import {theme, ThemeableMixin} from '@dojo/widget-core/main';
import {WidgetBase} from '@dojo/widget-core/WidgetBase';

export interface SideBySideEntry {
	price: string;
	label: string;
	description: string;
}

export interface SideBySideProperties extends WidgetProperties {
	options: SideBySideEntry[];
	selected: number;
	onOptionSelected?: (optionIndex: number) => void;
}

@theme(styles)
export default class SideBySide extends ThemeableMixin(WidgetBase)<SideBySideProperties> {
	onOptionSelected(index: number) {
		this.properties.onOptionSelected && this.properties.onOptionSelected(index);
	}

	render() {
		const { options = [] } = this.properties;

		return v('ul', {
			classes: this.classes(styles.sideBySideContainer)
		}, options.map((option, index) => {
			let classes = [];
			if (this.properties.selected === index) {
				classes.push(styles.sideBySideSelected);
			}

			return v('li', {
				key: `option-${index}`,
				classes: this.classes(...classes)
			}, [
				v('label', {
					classes: this.classes(styles.sideBySidePrice)
				}, [ option.price ]),
				v('p', {
					classes: this.classes(styles.sideBySideLabel)
				}, [ option.label ]),
				v('p', {
					classes: this.classes(styles.sideBySideDescription)
				}, [ option.description ]),
				w(CallToAction, {
					key: `option-${index}`,
					style: this.properties.selected === index ? 'green' : 'blue',
					label: this.properties.selected === index ? 'Buy Now' : 'Select',
					onClick: this.onOptionSelected.bind(this, index)
				})
			]);
		}));
	}
}
