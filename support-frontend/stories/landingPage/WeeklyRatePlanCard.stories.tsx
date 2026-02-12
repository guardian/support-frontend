import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import type { Product } from 'components/product/productOption';
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
			<WeeklyRatePlanCard {...args} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const DefaultWeeklyCard = Template.bind({});
DefaultWeeklyCard.args = {
	showLabel: true,
	title: 'Quartlerly',
	price: '£49.50',
	discountedPrice: '£24.75',
	billingPeriodNoun: 'quarterly',
	priceCopy: '£24.75/month for 3 months, then £49.50/month',
	offerCopy: '50% off for 3 months',
	href: 'https://support.theguardian.com',
	onClick: () => {},
	onView: () => {},
} satisfies Product;
