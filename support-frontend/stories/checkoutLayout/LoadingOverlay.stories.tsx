import type { LoadingOverlayProps } from 'components/loadingOverlay/loadingOverlay';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkout Layout/Loading Overlay',
	component: LoadingOverlay,
	argTypes: {},
	decorators: [withCenterAlignment, withSourceReset],
	parameters: {
		docs: {
			description: {
				component:
					'An accessible alert dialog to overlay the page and prevent interaction while payment is processing',
			},
		},
	},
};

function Template(args: LoadingOverlayProps) {
	return <LoadingOverlay>{args.children}</LoadingOverlay>;
}

Template.args = {} as LoadingOverlayProps;

export const Default = Template.bind({});

Default.args = {
	children: (
		<>
			<p>Processing transaction</p>
			<p>Please wait</p>
		</>
	),
};
