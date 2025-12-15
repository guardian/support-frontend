import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { StoryObj } from '@storybook/preact-vite';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import {
	DigitalPack,
	GuardianWeekly,
} from 'helpers/productPrice/subscriptions';
import { PromotionTermsPage } from 'pages/promotion-terms/promotionTerms';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';

export default {
	title: 'Pages/Promotion Terms',
	component: PromotionTermsPage,
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

const emptyProductPrices = {} as unknown as ProductPrices;

const basePromotionTerms: PromotionTerms = {
	description:
		'Subscribe today and save with our limited-time offer on your chosen product.',
	starts: new Date('2025-01-01T00:00:00.000Z'),
	expires: new Date('2025-12-31T23:59:59.000Z'),
	product: DigitalPack,
	productRatePlans: ['Monthly subscription', 'Annual subscription'],
	promoCode: 'STORYBOOKPROMO',
	isGift: false,
};

type Story = StoryObj<PromotionTermsPropTypes>;

const digitalPackArgs: PromotionTermsPropTypes = {
	productPrices: emptyProductPrices,
	promotionTerms: {
		...basePromotionTerms,
		product: DigitalPack,
		productRatePlans: ['Digital Pack Monthly', 'Digital Pack Annual'],
	},
	countryGroupId: GBPCountries,
};

const guardianWeeklyArgs: PromotionTermsPropTypes = {
	productPrices: emptyProductPrices,
	promotionTerms: {
		...basePromotionTerms,
		product: GuardianWeekly,
		productRatePlans: ['Guardian Weekly Annual', 'Guardian Weekly Quarterly'],
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
