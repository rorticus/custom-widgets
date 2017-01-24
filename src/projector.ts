import createProjector from '@dojo/widget-core/createProjector';
import { DNode } from '@dojo/widget-core/interfaces';
import { w } from '@dojo/widget-core/d';
import createCallToAction from './widgets/createCallToAction';

export default createProjector.mixin({
	mixin: {
		getChildrenNodes(): DNode[] {
			return [
				w(createCallToAction, {
					label: 'Sign Up Now!',
					onClick: () => {
						alert('click!');
					}
				})
			];
		}
	}
});
