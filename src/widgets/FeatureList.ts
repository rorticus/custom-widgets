import {DNode, WidgetProperties} from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import * as styles from './styles/featureList.css';
import {ThemeableMixin, theme} from '@dojo/widget-core/main';
import {WidgetBase} from '@dojo/widget-core/WidgetBase';

interface FeatureListProperties extends WidgetProperties {
	limit?: number;
	expanded?: boolean;
}

@theme(styles)
export default class FeatureList extends ThemeableMixin(WidgetBase)<FeatureListProperties> {
	private _expanded = false;

	onExpand(this: FeatureList) {
		this._expanded = true;
		this.invalidate();
	}

	onCollapse(this: FeatureList) {
		this._expanded = false;
		this.invalidate();
	}

	getChildrenNodes(this: FeatureList): DNode[] {
		const { limit = 3 } = this.properties;

		let childNodes = [];

		if (this._expanded) {
			childNodes = [ ... this.children ];
			childNodes.push(v('li', {
				key: 'see-less',
				onclick: this.onCollapse,
				classes: this.classes(styles.featureListLink)
			}, [ 'See less...' ]));
		}
		else {
			childNodes = this.children.slice(0, limit);
			childNodes.push(v('li', {
				key: 'see-more',
				onclick: this.onExpand,
				classes: this.classes(styles.featureListLink)
			}, [ 'See more...' ]));
		}

		return childNodes;
	}

	render(): DNode {
		return v('ul', {
			classes: this.classes(styles.featureList)
		}, this.getChildrenNodes());
	}
}
