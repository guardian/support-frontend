import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { StoryObj } from '@storybook/preact-vite';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { WeeklyLandingPage } from 'pages/weekly-subscription-landing/weeklySubscriptionLanding';
import type { WeeklyLandingPropTypes } from 'pages/weekly-subscription-landing/weeklySubscriptionLandingProps';

export default {
	title: 'Pages/Subscriptions Weekly',
	component: WeeklyLandingPage,
	parameters: {
		docs: {
			description: {
				component:
					'A full-page rendering of the Subscriptions Newspaper landing page.',
			},
		},
	},
};

const weeklyProductPrices = {
	'United Kingdom': {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					GBP: {
						price: 16.5,
						currency: 'GBP',
						promotions: [],
					},
				},
				Quarterly: {
					GBP: {
						price: 49.5,
						currency: 'GBP',
						promotions: [],
					},
				},
				Annual: {
					GBP: {
						price: 150,
						currency: 'GBP',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 135,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
} as unknown as ProductPrices;

type Story = StoryObj<WeeklyLandingPropTypes>;

const defaultArgs: WeeklyLandingPropTypes = {
	countryId: 'GB',
	countryGroupId: GBPCountries,
	productPrices: weeklyProductPrices,
	promotionCopy: undefined,
	orderIsAGift: false,
	participations: {},
};
const giftArgs: WeeklyLandingPropTypes = {
	...defaultArgs,
	orderIsAGift: true,
};

export const Default: Story = {
	render: (args: WeeklyLandingPropTypes) => <WeeklyLandingPage {...args} />,
	args: defaultArgs,
};

export const Gift: Story = {
	render: (args: WeeklyLandingPropTypes) => <WeeklyLandingPage {...args} />,
	args: giftArgs,
};
