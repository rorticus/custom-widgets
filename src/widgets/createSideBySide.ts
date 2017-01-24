import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { DNode, Widget } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import { VNodeProperties } from '@dojo/interfaces/vdom';
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
					classes: Object.keys(this.theme.selected).reduce((classes: any, className) => {
						classes[ className ] = this.properties.selected === index;
						return classes;
					}, {})
				}, [
					v('label', {
						classes: this.theme.price
					}, [ option.price ]),
					v('p', {
						classes: this.theme.label
					}, [ option.label ]),
					v('p', {
						classes: this.theme.description
					}, [ option.description ]),
					w(createCallToAction, {
						id: `option${index + 1}`,
						style: this.properties.selected === index ? 'green' : 'blue',
						label: this.properties.selected === index ? 'Buy Now' : 'Select',
						onClick: this.onOptionSelected.bind(this, index)
					})
				]);
			});
		}
	}
});
