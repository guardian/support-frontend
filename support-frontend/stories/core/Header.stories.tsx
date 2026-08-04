import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import Header from 'components/headers/header/header';

export default {
	title: 'Core/Header',
	component: Header,
	argTypes: {
		display: {
			control: {
				type: 'radio',
				options: ['navigation', 'checkout', 'guardianLogo'],
			},
		},
		supportRegionId: {
			control: {
				type: 'select',
				options: [
					'uk',
					'us',
					'au',
					'eu',
					'nz',
					'ca',
					'int',
				],
			},
		},
	},
};

function Template(args: { supportRegionId: SupportRegionId }): JSX.Element {
	return <Header supportRegionId={args.supportRegionId} />;
}

Template.args = {} as Record<string, unknown>;

export const Navigation = Template.bind({});

Navigation.args = {
	supportRegionId: 'uk',
};
