import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import {
	currencies,
	type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { productCatalogDescription } from 'helpers/productCatalog';
import type { ThreeTierCardsProps } from 'pages/supporter-plus-landing/components/threeTierCards';
import { ThreeTierCards } from 'pages/supporter-plus-landing/components/threeTierCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'LandingPage/Three Tier Cards',
	component: ThreeTierCards,
	argTypes: {
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
				component: `three tierCards, each linking onto checkout from the three tier landing page.`,
			},
		},
	},
};

function Template(args: ThreeTierCardsProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: 25px;
	`;
	return (
		<div css={innerContentContainer}>
			<ThreeTierCards {...args} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	cardsContent: [
		{
			isRecommended: false,
			isUserSelected: false,
			price: 5,
			productDescription: productCatalogDescription.Contribution,
		},
		{
			isRecommended: true,
			isUserSelected: false,
			price: 10,
			productDescription: productCatalogDescription.SupporterPlus,
		},
		{
			isRecommended: false,
			isUserSelected: true,
			price: 25,
			productDescription:
				productCatalogDescription.SupporterPlusWithGuardianWeekly,
			promotion: {
				discountedPrice: 16,
				discount: {
					amount: 16,
					durationMonths: 12,
				},
			},
		},
	],
	currencyId: 'GBP',
	paymentFrequency: 'MONTHLY',
};
