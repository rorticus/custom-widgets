import { WidgetFactory, DNode, WidgetProperties } from '@dojo/widgets/interfaces';
import createProjector from '@dojo/widgets/createProjector';
import { w } from '@dojo/widgets/d';
import { forOf } from '@dojo/shim/iterator';
import { Projector } from '@dojo/widgets/mixins/createProjectorMixin';

declare namespace document {
	function registerElement(name: string, constructor: any): Function;
}

function generateProperties(element: HTMLElement): WidgetProperties {
	const props: WidgetProperties = {};

	forOf(element.attributes, (attribute) => {
		if (attribute.specified) {
			props[ attribute.name ] = attribute.value;
		}
	});

	return props;
}

export class CustomElement extends HTMLElement {
	widget: WidgetFactory<any, any>;
	projector: Projector;

	createdCallback() {
		const self = this;

		const projector = createProjector.mixin({
			mixin: {
				getChildrenNodes(): DNode[] {
					return [
						w(self.widget, generateProperties(self))
					];
				}
			}
		})({
			root: this
		});

		projector.append();
		this.projector = projector;
	}

	attributeChangedCallback() {
		this.projector.invalidate();
	}
}

export default function registerCustomElement(tagName: string, widget: any): Function {
	return document.registerElement(tagName, {
		prototype: Object.create(CustomElement.prototype, {
			widget: { value: widget }
		})
	});
}
