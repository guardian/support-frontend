import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { StoryObj } from '@storybook/preact-vite';
import { PromotionTermsPage } from 'pages/promotion-terms/promotionTerms';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsPropTypes';
import { hideTestBanner } from '../../.storybook/decorators/withoutTestBanner';

export default {
	title: 'Pages/Promotion Terms',
	component: PromotionTermsPage,
	decorators: [hideTestBanner],
	parameters: {
		docs: {
			description: {
				component:
					'A full-page rendering of the promotion terms and conditions experience.',
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

const basePromotion: Omit<PromoWithCatalogInformation, 'appliesTo'> = {
	promoCode: 'STORYBOOKPROMO',
	name: 'Storybook promotion',
	campaignCode: 'STORYBOOK_CAMPAIGN',
	description:
		'Subscribe today and save with our limited-time offer on your chosen product.',
	startTimestamp: '2025-01-01T00:00:00.000Z',
	endTimestamp: '2025-12-31T23:59:59.000Z',
};

type Story = StoryObj<PromotionTermsPropTypes>;

const digitalPackArgs: PromotionTermsPropTypes = {
	promotion: {
		...basePromotion,
		appliesTo: {
			productRatePlanIds: [],
			countries: [],
			catalogRatePlans: [
				{ productKey: 'DigitalSubscription', productRatePlanKey: 'Monthly' },
				{ productKey: 'DigitalSubscription', productRatePlanKey: 'Annual' },
			],
		},
	},
	countryGroupId: GBPCountries,
};

const guardianWeeklyArgs: PromotionTermsPropTypes = {
	promotion: {
		...basePromotion,
		appliesTo: {
			productRatePlanIds: [],
			countries: [],
			catalogRatePlans: [
				{
					productKey: 'GuardianWeeklyDomestic',
					productRatePlanKey: 'Annual',
				},
				{
					productKey: 'GuardianWeeklyDomestic',
					productRatePlanKey: 'Quarterly',
				},
			],
		},
	},
	countryGroupId: GBPCountries,
};

export const DigitalPackPromotion: Story = {
	render: (args: PromotionTermsPropTypes) => <PromotionTermsPage {...args} />,
	args: digitalPackArgs,
};

export const GuardianWeeklyPromotion: Story = {
	render: (args: PromotionTermsPropTypes) => <PromotionTermsPage {...args} />,
	args: guardianWeeklyArgs,
};
