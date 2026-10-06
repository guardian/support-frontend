import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { StoryObj } from '@storybook/preact-vite';
import { PromoTermsProvider } from 'contexts/PromoTermsContext';
import { productCatalogFixture } from 'fixtures/productCatalogFixture';
import { PaperLandingPage } from 'pages/paper-subscription-landing/paperSubscriptionLandingPage';
import type { PaperLandingPropTypes } from 'pages/paper-subscription-landing/paperSubscriptionLandingProps';
import { hideTestBanner } from '../../.storybook/decorators/withoutTestBanner';

export default {
	title: 'Pages/Subscriptions Newspaper',
	component: PaperLandingPage,
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
	catalogRatePlan: PromoWithCatalogInformation['appliesTo']['catalogRatePlans'][number],
	discount: { amount: number; durationMonths: number },
): PromoWithCatalogInformation => ({
	promoCode,
	name: promoCode,
	campaignCode: 'PAPER_CAMPAIGN',
	appliesTo: {
		productRatePlanIds: [],
		countries: ['GB'],
		catalogRatePlans: [catalogRatePlan],
	},
	startTimestamp: '2025-01-01T00:00:00.000Z',
	endTimestamp: '2099-12-31T23:59:59.000Z',
	discount,
});

const sixdayPromotion = makePromotion(
	'SIXDAY25',
	{ productKey: 'SubscriptionCard', productRatePlanKey: 'SixdayPlus' },
	{ amount: 25, durationMonths: 6 },
);

type Story = StoryObj<PaperLandingPropTypes>;

const defaultArgs: PaperLandingPropTypes = {
	productCatalog: productCatalogFixture,
	promotions: [],
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
	render: (args: PaperLandingPropTypes) => (
		<PromoTermsProvider>
			<PaperLandingPage {...args} />
		</PromoTermsProvider>
	),
	args: homeDeliveryArgs,
};

export const NewspaperCollection: Story = {
	render: (args: PaperLandingPropTypes) => (
		<PromoTermsProvider>
			<PaperLandingPage {...args} />
		</PromoTermsProvider>
	),
	args: collectionArgs,
};

export const NewspaperCollectionWithPromotion: Story = {
	render: (args: PaperLandingPropTypes) => (
		<PromoTermsProvider>
			<PaperLandingPage {...args} />
		</PromoTermsProvider>
	),
	args: {
		...collectionArgs,
		promotions: [sixdayPromotion],
		promoCode: sixdayPromotion.promoCode,
	},
};
