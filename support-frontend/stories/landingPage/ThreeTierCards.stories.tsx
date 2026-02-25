import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import { CurrencyValues } from '@modules/internationalisation/currency';
import type { ThreeTierCardsProps } from 'pages/supporter-plus-landing/components/threeTierCards';
import { ThreeTierCards } from 'pages/supporter-plus-landing/components/threeTierCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';
import { fallBackLandingPageSelection } from '../../assets/helpers/abTests/landingPageAbTests';

export default {
	title: 'LandingPage/Three Tier Cards',
	component: ThreeTierCards,
	argTypes: {
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
			isUserSelected: false,
			price: 5,
			product: 'Contribution',
			...fallBackLandingPageSelection.products.Contribution,
		},
		{
			isUserSelected: false,
			price: 10,
			product: 'SupporterPlus',
			...fallBackLandingPageSelection.products.SupporterPlus,
		},
		{
			isUserSelected: true,
			price: 25,
			product: 'DigitalSubscription',
			...fallBackLandingPageSelection.products.DigitalSubscription,
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

export const BillingPeriodsCopy = Template.bind({});

BillingPeriodsCopy.args = {
	cardsContent: [
		{
			isUserSelected: false,
			price: 5,
			product: 'Contribution',
			...fallBackLandingPageSelection.products.Contribution,
		},
		{
			isUserSelected: false,
			price: 10,
			product: 'SupporterPlus',
			...fallBackLandingPageSelection.products.SupporterPlus,
			billingPeriodsCopy:
				'From %%PRICE_PRODUCT_WEEKLY%% per week, billed monthly or annually.',
		},
		{
			isUserSelected: true,
			price: 25,
			product: 'DigitalSubscription',
			...fallBackLandingPageSelection.products.DigitalSubscription,
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
	billingPeriod: 'Monthly',
};
