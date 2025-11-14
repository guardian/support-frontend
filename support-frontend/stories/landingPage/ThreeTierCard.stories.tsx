import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import { CurrencyValues } from '@modules/internationalisation/currency';
import type { ThreeTierCardProps } from 'pages/supporter-plus-landing/components/threeTierCard';
import { ThreeTierCard } from 'pages/supporter-plus-landing/components/threeTierCard';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';
import { fallBackLandingPageSelection } from '../../assets/helpers/abTests/landingPageAbTests';

const promotionEURCountries = {
	name: 'SupportPlusAndGuardianWeekly',
	description: 'Supporter Plus and Guardian Weekly',
	promoCode: '3TIER_WEEKLY_EU_MONTHLY_V2',
	discountedPrice: 30,
	discount: {
		amount: 22.09,
		durationMonths: 12,
	},
} as const;

export default {
	title: 'LandingPage/Three Tier Card',
	component: ThreeTierCard,
	argTypes: {
		cardTier: 1,
		promoCount: 1,
		linkCtaClickHandler: { action: 'tier card clicked' },
		currencyId: {
			options: CurrencyValues,
			control: { type: 'radio' },
		},
	},
	decorators: [withCenterAlignment, withSourceReset],
	parameters: {
		docs: {
			description: {
				component: `A tierCard component linking onto checkout from the three tier landing page.`,
			},
		},
	},
};

function Template(args: ThreeTierCardProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: 25px;
	`;
	return (
		<div css={innerContentContainer}>
			<ThreeTierCard {...args} />;
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	isSubdued: false,
	currencyId: 'GBP',
	paymentFrequency: 'MONTHLY',
	cardTier: 2,
	cardContent: {
		...fallBackLandingPageSelection.products.SupporterPlus,
		product: 'SupporterPlus',
		isUserSelected: false,
		price: 12,
		cta: { copy: 'Support' },
		label: { copy: 'Highest impact' },
	},
};

export const Promotion = Template.bind({});

Promotion.args = {
	isSubdued: false,
	currencyId: 'EUR',
	paymentFrequency: 'MONTHLY',
	cardTier: 3,
	cardContent: {
		...fallBackLandingPageSelection.products.TierThree,
		product: 'TierThree',
		isUserSelected: false,
		price: 38.5,
		cta: { copy: 'Support' },
		label: { copy: 'Highest impact' },
		promotion: promotionEURCountries,
	},
};
