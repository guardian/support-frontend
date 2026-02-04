import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { StoryObj } from '@storybook/preact-vite';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { WeeklyLandingPageProps } from 'pages/weekly-subscription-landing/weeklySubscriptionLanding';
import { WeeklyLandingPage } from 'pages/weekly-subscription-landing/weeklySubscriptionLanding';
import { hideTestBanner } from '../../.storybook/decorators/withoutTestBanner';

export default {
	title: 'Pages/Subscriptions Weekly',
	component: WeeklyLandingPage,
	decorators: [hideTestBanner],
	parameters: {
		docs: {
			description: {
				component:
					'A full-page rendering of the Subscriptions Newspaper landing page.',
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
						promotions: [
							{
								name: 'GW 50off3 Always-On',
								description: '50% Off for 3 months',
								promoCode: '50OFF3',
								discountedPrice: 24.75,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 50,
									durationMonths: 3,
								},
								landingPage: {
									description: `<p>Discover fresh perspectives on the global stories you thought you knew with the Guardian Weekly magazine. We’ll take you beyond the breaking headlines, with fact-based journalism that challenges and inspires. We also showcase the best of Guardian longform features, opinion writing and arts coverage. Whatever you’re into, there’s something to keep you turning those pages. For less than the price of a coffee per issue, treat yourself to a subscription today. <p>Looking for a Christmas gift? Check out our gift subscription offers via the link at the bottom of this page.</p>`,
									roundel: '50% off for 3 months',
									title: 'For Page Turners',
								},
							},
						],
					},
				},
				Annual: {
					GBP: {
						price: 150,
						currency: 'GBP',
						promotions: [
							{
								name: 'GW 20% off annual',
								description: '20% off a year',
								promoCode: '20ANNUAL',
								discountedPrice: 158.4,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 20,
									durationMonths: 12,
								},
								landingPage: {
									description: `<p>The Guardian Weekly magazine is a round-up of the world news, opinion and long reads that have shaped the week, helping you digest our reporting in a more considered way, outside of busy, daily news feeds. Inside, the past seven days' most memorable stories are reframed with striking photography and insightful companion pieces, handpicked from across the Guardian's award-winning, independent journalism, from names you can trust, such as Emma Graham-Harrison, Patrick Wintour, Zoe Williams, Jonathan Freedland, Sonia Sodha and Simon Hattenstone.</p><p>Are you studying in the UK? Take advantage of our student offer - 70% off for 3 months. Scroll down to the bottom of the page and click 'Student subscriptions'.</p>`,
									roundel: '20% off an annual subscription',
									title: 'Open up your world view',
								},
							},
						],
					},
				},
			},
		},
	},
} as unknown as ProductPrices;

type Story = StoryObj<WeeklyLandingPageProps>;

const defaultArgs: WeeklyLandingPageProps = {
	countryId: 'GB',
	countryGroupId: GBPCountries,
	productPrices: weeklyProductPrices,
	promotionCopy: undefined,
	orderIsAGift: false,
};
const giftArgs: WeeklyLandingPageProps = {
	...defaultArgs,
	orderIsAGift: true,
};

export const Default: Story = {
	render: (args: WeeklyLandingPageProps) => <WeeklyLandingPage {...args} />,
	args: defaultArgs,
};

export const Gift: Story = {
	render: (args: WeeklyLandingPageProps) => <WeeklyLandingPage {...args} />,
	args: giftArgs,
};
