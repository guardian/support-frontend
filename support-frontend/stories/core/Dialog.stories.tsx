import Dialog from 'components/dialog/dialog';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Core/Dialog',
	component: Dialog,
	argTypes: {
		closeDialog: { action: 'closed' },
	},
	decorators: [withCenterAlignment],
};

function Template(args: {
	closeDialog: () => void;
	open: boolean;
	blocking: boolean;
}) {
	return (
		<Dialog
			aria-label="Modal dialog"
			closeDialog={args.closeDialog}
			open={args.open}
			blocking={args.blocking}
		>
			<p
				style={{
					padding: '1em',
					background: '#ffffff',
					maxWidth: '600px',
				}}
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
				justo at est elementum egestas rhoncus eu nulla. Proin pellentesque
				massa at metus condimentum, a aliquam erat condimentum. Vivamus quis
				rutrum nulla. Curabitur ut ullamcorper magna, eu ornare nunc.
			</p>
		</Dialog>
	);
}

Template.args = {} as Record<string, unknown>;

export const Blocking = Template.bind({});

Blocking.args = {
	open: true,
	blocking: true,
};

export const CloseableWithClickOutside = Template.bind({});

CloseableWithClickOutside.args = {
	open: true,
	blocking: false,
};
