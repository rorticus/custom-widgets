import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { DNode, Widget } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import * as styles from './styles/sideBySide.css';
import createCallToAction from './createCallToAction';

export interface SideBySideEntry {
	price: string;
	label: string;
	description: string;
}

export interface SideBySideProperties {
	options: SideBySideEntry[];
	selected: number;
	onOptionSelected?: (optionIndex: number) => void;
}

export type SideBySideWidget = Widget<SideBySideProperties> & Themeable & {
	onOptionSelected: (event?: MouseEvent) => void;
};

export default createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: styles,
		tagName: 'ul',

		onOptionSelected(this: SideBySideWidget, index: number) {
			this.properties.onOptionSelected && this.properties.onOptionSelected(index);
		},
		getChildrenNodes(this: SideBySideWidget): DNode[] {
			const { options = [] } = this.properties;

			return options.map((option, index) => {
				let classes = [];
				if (this.properties.selected === index) {
					classes.push(styles.sideBySideSelected);
				}

				return v('li', {
					key: `option-${index}`,
					classes: this.classes(...classes).get()
				}, [
					v('label', {
						classes: this.classes(styles.sideBySidePrice).get()
					}, [ option.price ]),
					v('p', {
						classes: this.classes(styles.sideBySideLabel).get()
					}, [ option.label ]),
					v('p', {
						classes: this.classes(styles.sideBySideDescription).get()
					}, [ option.description ]),
					w(createCallToAction, {
						key: `option-${index}`,
						style: this.properties.selected === index ? 'green' : 'blue',
						label: this.properties.selected === index ? 'Buy Now' : 'Select',
						onClick: this.onOptionSelected.bind(this, index)
					})
				]);
			});
		}
	}
}).aspect({
	after: {
		render(this: SideBySideWidget) {
			const { onClick: onclick } = this;

			return v('ul', {
				onclick,
				classes: this.classes(styles.sideBySideContainer).get()
			}, this.getChildrenNodes());
		}
	}
});
