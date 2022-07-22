import { neutral } from '@guardian/source-foundations';
import { Container } from 'components/layout/container';

export default {
	title: 'Checkout Layout/Container',
	component: Container,
	decorators: [
		(Story: React.FC): JSX.Element => {
			return (
				<div style={{ padding: '1rem' }}>
					<Story />
				</div>
			);
		},
	],
	parameters: {
		docs: {
			description: {
				component:
					'A slightly modified version of the Container component from Source, to provide the correct internal padding to match Dotcom',
			},
		},
	},
};

function Template(args: {
	sidePadding?: boolean;
	topBorder?: boolean;
	sideBorders?: boolean;
	borderColor?: string;
	backgroundColor?: string;
}) {
	return (
		<Container {...args}>
			<p style={{ background: 'lightblue' }}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut faucibus
				nibh erat, eget rutrum ligula vehicula sit amet. Etiam scelerisque
				dapibus pulvinar. Integer non accumsan justo. Duis et vehicula risus.
				Nulla ligula eros, consequat sodales lectus eget, eleifend venenatis
				neque.
			</p>
		</Container>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	sidePadding: true,
	topBorder: false,
	sideBorders: false,
	borderColor: neutral[86],
	backgroundColor: '',
};

export const SideBorders = Template.bind({});

SideBorders.args = {
	sideBorders: true,
	sidePadding: true,
	topBorder: false,
	borderColor: neutral[86],
	backgroundColor: '',
};

export const TopBorder = Template.bind({});

TopBorder.args = {
	topBorder: true,
	sidePadding: true,
	sideBorders: false,
	borderColor: neutral[86],
	backgroundColor: '',
};
