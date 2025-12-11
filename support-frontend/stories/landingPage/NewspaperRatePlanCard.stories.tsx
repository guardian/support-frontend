import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import type { Product } from 'components/product/productOption';
import NewspaperRatePlanCard from 'pages/paper-subscription-landing/components/NewspaperRatePlanCard';
import { Channel } from 'pages/paper-subscription-landing/helpers/products';

export default {
	title: 'LandingPage/NewspaperRatePlanCard',
	component: NewspaperRatePlanCard,
	argTypes: {},
};

function Template(args: Product) {
	const innerContentContainer = css`
		max-width: 500px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: ${space[6]}px;
	`;

	return (
		<div css={innerContentContainer}>
			<NewspaperRatePlanCard {...args} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const GuardianNewspaperCard = Template.bind({});
GuardianNewspaperCard.args = {
	title: 'Six day',
	price: '£73.99',
	href: 'https://support.theguardian.com',
	onClick: () => {},
	onView: () => {},
	buttonCopy: 'Subscribe',
	priceCopy: '', // Not used in this component
	planData: {
		description: '', // Not used in this component
		benefits: {
			label: 'Benefits label',
			items: ['Benefit 1', 'Benefit 2'],
		},
		digitalRewards: {
			label: 'Digital rewards label',
			items: ['Digital reward 1', 'Digital reward 2'],
		},
	},
	offerCopy: '',
	showLabel: 'Most popular',
	productLabel: {
		text: 'The Guardian + the Observer',
		channel: Channel.ObserverAndGuardian,
	},
	unavailableOutsideLondon: false,
};

export const ObserverNewspaperCard = Template.bind({});
ObserverNewspaperCard.args = {
	title: 'Sunday',
	price: '£20.99',
	href: 'https://support.theguardian.com',
	onClick: () => {},
	onView: () => {},
	buttonCopy: 'Subscribe',
	priceCopy: '', // Not used in this component
	planData: {
		description: '', // Not used in this component
		benefits: {
			label: 'Benefits label',
			items: ['Benefit 1', 'Benefit 2'],
		},
		digitalRewards: {
			label: 'Digital rewards label',
			items: ['Digital reward 1', 'Digital reward 2'],
		},
	},
	offerCopy: '',
	showLabel: 'Most popular',
	productLabel: {
		text: 'The Observer',
		channel: Channel.Observer,
	},
	unavailableOutsideLondon: true,
};
