import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { Widget, DNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import themeable from '@dojo/widget-core/mixins/themeable';
import { VNodeProperties } from '@dojo/interfaces/vdom';
import * as styles from './styles/featureList.css';
import { Themeable } from '@dojo/widget-core/mixins/themeable';

interface FeatureListProperties {
	limit?: number;
	expanded?: boolean;
}

type FeatureList = Widget<FeatureListProperties> & Themeable<typeof styles> & {
	onExpand: () => void;
	onCollapse: () => void;
};

export default createWidgetBase.mixin(themeable).mixin({
	mixin: {
		tagName: 'ul',
		baseTheme: styles,
		nodeAttributes: [
			function (this: FeatureList): VNodeProperties {
				return {
					classes: this.theme.featureList
				};
			}
		],
		onExpand(this: FeatureList) {
			this.setProperties({ ... this.properties, expanded: true });
		},
		onCollapse(this: FeatureList) {
			this.setProperties({ ... this.properties, expanded: false });
		},
		getChildrenNodes(this: FeatureList): DNode[] {
			const { limit = 3, expanded = false } = this.properties;

			let childNodes = [];

			if (expanded) {
				childNodes = [ ... this.children ];
				childNodes.push(v('li', {
					key: 'see-less',
					onclick: this.onCollapse,
					classes: this.theme.featureListLink
				}, [ 'See less...' ]));
			}
			else {
				childNodes = this.children.slice(0, limit);
				childNodes.push(v('li', {
					key: 'see-more',
					onclick: this.onExpand,
					classes: this.theme.featureListLink
				}, [ 'See more...' ]));
			}

			return childNodes;
		}
	}
});
