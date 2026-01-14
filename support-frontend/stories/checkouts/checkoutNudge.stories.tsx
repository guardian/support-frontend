import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source/react-components';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutNudge } from 'components/checkoutNudge/checkoutNudge';
import type { CheckoutNudgeProps } from 'components/checkoutNudge/checkoutNudge';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Checkout Nudge',
	component: CheckoutNudge,
	argTypes: {},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Box>
						<BoxContents>
							<Story />
						</BoxContents>
					</Box>
				</Column>
			</Columns>
		),
		withCenterAlignment,
		withSourceReset,
	],
};

function Template(props: CheckoutNudgeProps) {
	return <CheckoutNudge {...props} />;
}

Template.args = {} as CheckoutNudgeProps;

export const Default = Template.bind({});

Default.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Make a bigger impact',
	body: 'The reliability of recurring support powers our journalism in perpetuity. Could you make a small monthly contribution instead? Cancel anytime.',
	product: 'Contribution',
	ratePlan: 'Monthly',
	amount: 5,
};

export const Annual = Template.bind({});

Annual.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Make a bigger impact',
	body: 'The reliability of recurring support powers our journalism in perpetuity. Could you make an annual contribution instead? Cancel anytime.',
	product: 'Contribution',
	ratePlan: 'Annual',
	amount: 5,
};

export const BenefitsList = Template.bind({});

BenefitsList.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Make the biggest impact',
	product: 'SupporterPlus',
	ratePlan: 'Monthly',
	amount: 15,
	benefits: {
		label: 'Your all-access benefits:',
		checkListData: [
			{ isChecked: true, text: 'Unlimited access to the Guardian app' },
			{ isChecked: true, text: 'Ad-free reading on all your devices' },
		],
	},
};

export const WithPromotion = Template.bind({});

WithPromotion.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Support us and save',
	body: 'Get all-access digital for less. Your support powers our independent journalism.',
	product: 'SupporterPlus',
	ratePlan: 'Monthly',
	amount: 12,
	promotion: {
		name: 'Special Offer',
		description: '25% off for 3 months',
		promoCode: 'PROMO25',
		discountedPrice: 9,
		numberOfDiscountedPeriods: 3,
		discount: {
			amount: 25,
			durationMonths: 3,
		},
		landingPage: {
			title: 'Special offer',
			description: 'Save 25% for your first 3 months',
			roundel: '25% off',
		},
	},
	benefits: {
		label: 'Your all-access benefits:',
		checkListData: [
			{ isChecked: true, text: 'Unlimited access to the Guardian app' },
			{ isChecked: true, text: 'Ad-free reading on all your devices' },
		],
	},
};

export const WithPromotionAnnual = Template.bind({});

WithPromotionAnnual.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Support us and save',
	body: 'Get all-access digital for less. Your support powers our independent journalism.',
	product: 'SupporterPlus',
	ratePlan: 'Annual',
	amount: 120,
	promotion: {
		name: 'Annual Special',
		description: '30% off annual subscription',
		promoCode: 'ANNUAL30',
		discountedPrice: 84,
		numberOfDiscountedPeriods: 1,
		discount: {
			amount: 30,
			durationMonths: 12,
		},
		landingPage: {
			title: 'Annual special offer',
			description: 'Save 30% on your annual subscription',
			roundel: '30% off',
		},
	},
};
