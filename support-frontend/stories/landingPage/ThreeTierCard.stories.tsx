import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import {
	currencies,
	type IsoCurrency,
} from 'helpers/internationalisation/currency';
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
			options: Object.keys(currencies) as IsoCurrency[],
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
	pillCopy: 'Highest impact',
	isSubdued: false,
	isUserSelected: false,
	currencyId: 'GBP',
	paymentFrequency: 'MONTHLY',
	price: 12,
	product: 'SupporterPlus',
	cardTier: 2,
	productDescription: fallBackLandingPageSelection.products.SupporterPlus,
	ctaCopy: 'Support',
};

export const Promotion = Template.bind({});

Promotion.args = {
	pillCopy: 'Highest impact',
	isSubdued: false,
	isUserSelected: false,
	currencyId: 'EUR',
	paymentFrequency: 'MONTHLY',
	price: 38.5,
	product: 'TierThree',
	cardTier: 3,
	productDescription: fallBackLandingPageSelection.products.TierThree,
	ctaCopy: 'Support',
	promotion: promotionEURCountries,
};
