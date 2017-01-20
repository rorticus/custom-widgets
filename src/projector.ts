import createProjector from '@dojo/widgets/createProjector';
import { DNode } from '@dojo/widgets/interfaces';
import { w } from '@dojo/widgets/d';
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
