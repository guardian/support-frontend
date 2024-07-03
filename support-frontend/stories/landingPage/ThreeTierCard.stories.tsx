import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import {
	currencies,
	type IsoCurrency,
} from 'helpers/internationalisation/currency';
import {
	productCatalogDescription,
	supporterPlusWithGuardianWeeklyMonthlyPromos,
} from 'helpers/productCatalog';
import type { ThreeTierCardProps } from 'pages/supporter-plus-landing/components/threeTierCard';
import { ThreeTierCard } from 'pages/supporter-plus-landing/components/threeTierCard';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

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
	isRecommended: true,
	isRecommendedSubdued: false,
	isUserSelected: false,
	currencyId: 'GBP',
	paymentFrequency: 'MONTHLY',
	price: 12,
	productDescription: productCatalogDescription.SupporterPlus,
};

export const Promotion = Template.bind({});

Promotion.args = {
	isRecommended: true,
	isRecommendedSubdued: false,
	isUserSelected: false,
	currencyId: 'EUR',
	paymentFrequency: 'MONTHLY',
	price: 38.5,
	productDescription: productCatalogDescription.SupporterPlusWithGuardianWeekly,
	promotion: supporterPlusWithGuardianWeeklyMonthlyPromos.EURCountries,
};

export const Offer = Template.bind({});

Offer.args = {
	isRecommended: false,
	isRecommendedSubdued: false,
	isUserSelected: true,
	currencyId: 'USD',
	paymentFrequency: 'MONTHLY',
	price: 15,
	productDescription: {
		...productCatalogDescription.SupporterPlusWithGuardianWeekly,
		offersSummary: [
			{ strong: true, copy: 'including a free book as our gift to you**' },
		],
		offers: [
			{
				copy: (
					<p>
						<span style={{ fontWeight: 'bold' }}>
							A free book as our gift to you
							<sup style={{ fontWeight: 'lighter', fontSize: '14px' }}>
								**
							</sup>{' '}
						</span>
						Choose from a selection curated by Guardian staff{' '}
					</p>
				),
			},
		],
	},
};
