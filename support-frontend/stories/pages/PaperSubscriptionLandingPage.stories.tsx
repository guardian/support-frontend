import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { StoryObj } from '@storybook/preact-vite';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { PaperLandingPage } from 'pages/paper-subscription-landing/paperSubscriptionLandingPage';
import type { PaperLandingPropTypes } from 'pages/paper-subscription-landing/paperSubscriptionLandingProps';

export default {
	title: 'Pages/Subscriptions Newspaper',
	component: PaperLandingPage,
	parameters: {
		docs: {
			description: {
				component:
					'A full-page rendering of the Subscriptions Newspaper landing page.',
			},
		},
	},
};

const paperProductPrices = {
	'United Kingdom': {
		Collection: {
			SixdayPlus: {
				Monthly: {
					GBP: {
						price: 41.12,
						savingVsRetail: 26,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			SaturdayPlus: {
				Monthly: {
					GBP: {
						price: 10.36,
						savingVsRetail: 13,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Sunday: {
				Monthly: {
					GBP: {
						price: 10.79,
						savingVsRetail: 13,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			WeekendPlus: {
				Monthly: {
					GBP: {
						price: 20.76,
						savingVsRetail: 20,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			EverydayPlus: {
				Monthly: {
					GBP: {
						price: 47.62,
						savingVsRetail: 29,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
		},
		HomeDelivery: {
			SixdayPlus: {
				Monthly: {
					GBP: {
						price: 54.12,
						savingVsRetail: 5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			SaturdayPlus: {
				Monthly: {
					GBP: {
						price: 14.69,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Sunday: {
				Monthly: {
					GBP: {
						price: 15.12,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'examplePromo',
								description: 'an example promotion',
								promoCode: 1234,
								introductoryPrice: {
									price: 6.99,
									periodLength: 3,
									periodType: 'issue',
								},
							},
						],
					},
				},
			},
			WeekendPlus: {
				Monthly: {
					GBP: {
						price: 25.09,
						savingVsRetail: 2,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			EverydayPlus: {
				Monthly: {
					GBP: {
						price: 62.79,
						savingVsRetail: 9,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
		},
	},
} as unknown as ProductPrices;

type Story = StoryObj<PaperLandingPropTypes>;

const defaultArgs: PaperLandingPropTypes = {
	productPrices: paperProductPrices,
	promotionCopy: undefined,
	participations: {},
	fulfilment: undefined,
};

const homeDeliveryArgs = {
	...defaultArgs,
	fulfilment: HomeDelivery as PaperFulfilmentOptions,
};
const collectionArgs = {
	...defaultArgs,
	fulfilment: Collection as PaperFulfilmentOptions,
};

export const NewspaperHomeDelivery: Story = {
	render: (args: PaperLandingPropTypes) => <PaperLandingPage {...args} />,
	args: homeDeliveryArgs,
	parameters: {
		chromatic: {
			viewports: ['mobile', 'tablet', 'desktop', 'wide'],
		},
	},
};

export const NewspaperCollection: Story = {
	render: (args: PaperLandingPropTypes) => <PaperLandingPage {...args} />,
	args: collectionArgs,
	parameters: {
		chromatic: {
			viewports: ['mobile', 'tablet', 'desktop', 'wide'],
		},
	},
};
