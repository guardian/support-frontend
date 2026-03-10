import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { Product } from 'components/product/productOption';
import { PromoTermsProvider } from 'contexts/PromoTermsContext';
import WeeklyRatePlanCard from 'pages/weekly-subscription-landing/components/WeeklyRatePlanCard';

export default {
	title: 'LandingPage/WeeklyRatePlanCard',
	component: WeeklyRatePlanCard,
	argTypes: {},
};

function Template(args: Product) {
	const innerContentContainer = css`
		max-width: 500px;
		margin: 0 auto;
		background-color: ${palette.brand[400]};
		padding: ${space[10]}px;
	`;

	return (
		<div css={innerContentContainer}>
			<PromoTermsProvider>
				<WeeklyRatePlanCard {...args} somePriorityPromotion={false} />
			</PromoTermsProvider>
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const DefaultWeeklyCard = Template.bind({});
DefaultWeeklyCard.args = {
	title: 'Quartlerly',
	price: '£49.50',
	priceCopy: '',
	discountedPrice: '£24.75',
	billingPeriodNoun: 'quarterly',
	billingPeriod: BillingPeriod.Quarterly,
	discountSummary: '£24.75/month for 3 months, then £49.50/month',
	savingsText: '50% off for 3 months',
	href: 'https://support.theguardian.com',
	onClick: () => {},
	onView: () => {},
	buttonCopy: 'Subscribe',
} satisfies Product;
