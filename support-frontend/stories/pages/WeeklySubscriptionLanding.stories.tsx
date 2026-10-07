import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { StoryObj } from '@storybook/preact-vite';
import { productCatalogFixture } from 'fixtures/productCatalogFixture';
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

const makePromotion = (
	promoCode: string,
	name: string,
	ratePlanKey: 'QuarterlyPlus' | 'AnnualPlus' | 'OneYearGift',
	discount: { amount: number; durationMonths: number },
	landingPage?: PromoWithCatalogInformation['landingPage'],
): PromoWithCatalogInformation => ({
	promoCode,
	name,
	campaignCode: 'GW_CAMPAIGN',
	appliesTo: {
		productRatePlanIds: [],
		countries: ['GB'],
		catalogRatePlans: [
			{ productKey: 'GuardianWeeklyDomestic', productRatePlanKey: ratePlanKey },
		],
	},
	startTimestamp: '2025-01-01T00:00:00.000Z',
	discount,
	landingPage,
});

const promotions = [
	makePromotion('GWPLUSDIGITAL', 'GW 50off3 Always-On', 'QuarterlyPlus', {
		amount: 50,
		durationMonths: 3,
	}),
	makePromotion('25ANNUAL', 'GW 25% off annual', 'AnnualPlus', {
		amount: 25,
		durationMonths: 12,
	}),
	makePromotion(
		'GW20GIFT1Y',
		'GW 20% off 12 month gift',
		'OneYearGift',
		{ amount: 20, durationMonths: 12 },
		{ roundelHtml: 'Save 20% on a 12 month gift subscription' },
	),
];

type Story = StoryObj<WeeklyLandingPageProps>;

const defaultArgs: WeeklyLandingPageProps = {
	countryId: 'GB',
	countryGroupId: GBPCountries,
	productCatalog: productCatalogFixture,
	promotions,
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
