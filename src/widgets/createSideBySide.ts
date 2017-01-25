import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { DNode, Widget } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import { VNodeProperties } from '@dojo/interfaces/vdom';
import * as styles from './styles/sideBySide.css';
import createCallToAction from './createCallToAction';
import { toggleThemeClasses } from '../util';

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

export type SideBySideWidget = Widget<SideBySideProperties> & Themeable<typeof styles> & {
	onOptionSelected: (event?: MouseEvent) => void;
};

export default createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseTheme: styles,
		tagName: 'ul',

		nodeAttributes: [
			function (this: SideBySideWidget): VNodeProperties {
				const { onClick: onclick } = this;

				return {
					onclick,
					classes: this.theme.sideBySideContainer
				};
			}
		],
		onOptionSelected(this: SideBySideWidget, index: number) {
			this.properties.onOptionSelected && this.properties.onOptionSelected(index);
		},
		getChildrenNodes(this: SideBySideWidget): DNode[] {
			const { options = [] } = this.properties;

			return options.map((option, index) => {
				return v('li', {
					key: `option-${index}`,
					classes: toggleThemeClasses(this.theme.sideBySideSelected, this.properties.selected === index)
				}, [
					v('label', {
						classes: this.theme.sideBySidePrice
					}, [ option.price ]),
					v('p', {
						classes: this.theme.sideBySideLabel
					}, [ option.label ]),
					v('p', {
						classes: this.theme.sideBySideDescription
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
});
