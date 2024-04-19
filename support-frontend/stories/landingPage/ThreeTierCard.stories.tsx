import { css } from '@emotion/react';
import {
	currencies,
	type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { gwDeliverableCountries } from 'helpers/internationalisation/gwDeliverableCountries';
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
	return (
		<div
			css={css`
				text-align: center;
			`}
		>
			<ThreeTierCard {...args} />
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
	price: 10,
	productDescription: {
		label: 'All-access digital',
		benefits: [
			{
				copy: 'Unlimited access to the Guardian app',
				tooltip: `Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.`,
			},
			{ copy: 'Ad-free reading on all your devices' },
			{
				copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
			{
				copy: 'Far fewer asks for support',
				tooltip: `You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.`,
			},
		],
		ratePlans: {
			Monthly: {
				billingPeriod: 'Month',
			},
			Annual: {
				billingPeriod: 'Annual',
			},
		},
	},
};

export const Offer = Template.bind({});

Offer.args = {
	isRecommended: false,
	isRecommendedSubdued: false,
	isUserSelected: true,
	currencyId: 'USD',
	paymentFrequency: 'MONTHLY',
	price: 13,
	productDescription: {
		label: 'Digital + print',
		benefitsSummary: ['The rewards from All-access digital'],
		offersSummary: [
			{ strong: true, copy: 'including a free book as our gift to you**' },
		],
		benefits: [
			{
				copy: 'Guardian Weekly print magazine delivered to your door every week  ',
				tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
			},
		],
		ratePlans: {
			MonthlyWithGuardianWeekly: {
				billingPeriod: 'Month',
			},
			AnnualWithGuardianWeekly: {
				billingPeriod: 'Annual',
			},
			MonthlyWithGuardianWeeklyInt: {
				billingPeriod: 'Month',
			},
			AnnualWithGuardianWeeklyInt: {
				billingPeriod: 'Annual',
			},
		},
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

export const Promotion = Template.bind({});

Promotion.args = {
	isRecommended: true,
	isRecommendedSubdued: false,
	isUserSelected: false,
	currencyId: 'EUR',
	paymentFrequency: 'MONTHLY',
	productDescription: {
		label: 'Digital + print',
		benefitsSummary: [
			'The rewards from ',
			{ strong: true, copy: 'All-access digital' },
		],
		benefits: [
			{
				copy: 'Guardian Weekly print magazine delivered to your door every week  ',
				tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
			},
		],
		ratePlans: {
			MonthlyWithGuardianWeekly: {
				billingPeriod: 'Month',
			},
			AnnualWithGuardianWeekly: {
				billingPeriod: 'Annual',
			},
			MonthlyWithGuardianWeeklyInt: {
				billingPeriod: 'Month',
			},
			AnnualWithGuardianWeeklyInt: {
				billingPeriod: 'Annual',
			},
		},
		deliverableTo: gwDeliverableCountries,
	},
	price: 10,
	promotion: {
		discountedPrice: 5,
		discount: {
			amount: 5,
			durationMonths: 6,
		},
	},
};
