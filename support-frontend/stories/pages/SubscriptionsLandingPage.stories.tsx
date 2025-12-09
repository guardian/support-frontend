import type { Meta, StoryObj } from '@storybook/preact-vite';
import { MemoryRouter } from 'react-router-dom';
import { SubscriptionsLandingPage } from 'pages/subscriptions-landing/subscriptionsLanding';
import type { SubscriptionsLandingProps } from 'pages/subscriptions-landing/subscriptionsLandingProps';

const meta: Meta<SubscriptionsLandingProps> = {
	title: 'Pages/Subscriptions Landing Page',
	component: SubscriptionsLandingPage,
	parameters: {
		docs: {
			description: {
				component:
					'A full-page rendering of the Subscriptions landing experience, wrapped in a MemoryRouter for Storybook.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<SubscriptionsLandingProps>;

const defaultArgs: SubscriptionsLandingProps = {
	countryGroupId: 'GBPCountries',
	participations: {},
	pricingCopy: {
		GuardianWeekly: {
			price: 16.5,
			discountCopy: '',
		},
		DigitalPack: {
			price: 18,
			discountCopy: '',
		},
		Paper: {
			price: 12.19,
			discountCopy:
				'Guardian and Observer newspaper subscriptions to suit every reader',
		},
	},
	referrerAcquisitions: {
		componentType: 'ACQUISITIONS_OTHER',
		componentId: 'storybook-subscriptions-landing',
		campaignCode: 'storybook_subscriptions_landing',
		abTests: [
			{
				name: 'StorybookTest',
				variant: 'control',
			},
		],
	},
};

export const Default: Story = {
	render: (args: SubscriptionsLandingProps) => (
		<MemoryRouter>
			<SubscriptionsLandingPage {...args} />
		</MemoryRouter>
	),
	args: defaultArgs,
};
