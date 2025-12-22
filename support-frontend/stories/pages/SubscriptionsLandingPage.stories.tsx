import type { Meta, StoryObj } from '@storybook/preact-vite';
import { MemoryRouter } from 'react-router-dom';
import { SubscriptionsLandingPage } from 'pages/subscriptions-landing/subscriptionsLanding';
import type { SubscriptionsLandingProps } from 'pages/subscriptions-landing/subscriptionsLandingProps';
import { withProductCatalog } from '../../.storybook/decorators/withProductCatalog';

const meta: Meta<SubscriptionsLandingProps> = {
	title: 'Pages/Subscriptions Landing Page',
	component: SubscriptionsLandingPage,
	decorators: [withProductCatalog],
	parameters: {
		docs: {
			description: {
				component:
					'A full-page rendering of the Subscriptions landing experience, wrapped in a MemoryRouter for Storybook.',
			},
		},
		chromatic: {
			modes: {
				mobile: { viewport: 'mobile' },
				desktop: { viewport: 'desktop' },
				tablet: { viewport: 'tablet' },
				wide: { viewport: 'wide' },
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
	} as SubscriptionsLandingProps['pricingCopy'],
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
