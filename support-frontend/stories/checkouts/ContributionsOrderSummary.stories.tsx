import { css } from '@emotion/react';
import { Button, Column, Columns } from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { ContributionsOrderSummaryProps } from 'components/orderSummary/contributionsOrderSummary';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import {
	OrderSummaryStartDate,
	OrderSummaryTsAndCs,
} from 'components/orderSummary/orderSummaryTsAndCs';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import { productCatalogDescription } from 'helpers/productCatalog';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

const boldText = css`
	font-weight: bold;
`;

const checkListData = [
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>The Digital Edition app. </span>Enjoy the Guardian
				and Observer newspaper, available for mobile and tablet
			</p>
		),
	},
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>Full access to the Guardian app. </span>
				Read our reporting on the go
			</p>
		),
	},
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>Free 14 day trial. </span>Enjoy a free trial of
				your subscription, before you pay
			</p>
		),
	},
];

const oneYearStudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	discountPriceWithCurrency: '£9',
	fullPriceWithCurrency: '£120',
};

export default {
	title: 'Checkouts/Contributions Order Summary',
	component: ContributionsOrderSummary,
	argTypes: { onCheckListToggle: { action: 'accordion clicked' } },
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

function Template(props: ContributionsOrderSummaryProps) {
	return <ContributionsOrderSummary {...props} />;
}

Template.args = {} as ContributionsOrderSummaryProps;

export const Default = Template.bind({});
Default.args = {
	productKey: 'SupporterMembership',
	ratePlanKey: 'Monthly',
	productLabel: 'Monthly support',
	paymentFrequency: 'month',
	enableCheckList: true,
	amount: 10,
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: checkListData,
	tsAndCs: (
		<>
			<p>Auto renews every month until you cancel.</p>
			<p>
				Cancel or change your support anytime. If you cancel within the first 14
				days, you will receive a full refund.
			</p>
		</>
	),
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
};

export const SingleContribution = Template.bind({});
SingleContribution.args = {
	productKey: 'Contribution',
	ratePlanKey: 'OneTime',
	productLabel: 'One-off contribution',
	enableCheckList: false,
	amount: 25,
	currency: {
		glyph: '$',
		extendedGlyph: 'US$',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: [],
	tsAndCs: <></>,
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
};

export const RecurringContribution = Template.bind({});
RecurringContribution.args = {
	productKey: 'SupporterMembership',
	ratePlanKey: 'Monthly',
	productLabel: 'Support',
	enableCheckList: true,
	amount: 3,
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: [
		...productCatalogDescription.Contribution.benefits.map((benefit) => ({
			isChecked: true,
			text: benefit.copy,
		})),
	],
	tsAndCs: (
		<OrderSummaryTsAndCs
			productKey={'Contribution'}
			ratePlanKey={'Monthly'}
			countryGroupId={GBPCountries}
		/>
	),
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	productLabel: 'All-access Digital',
	enableCheckList: true,
	amount: 12,
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: [
		...productCatalogDescription.SupporterPlus.benefits.map((benefit) => ({
			isChecked: true,
			text: benefit.copy,
		})),
	],
	tsAndCs: (
		<OrderSummaryTsAndCs
			productKey={'SupporterPlus'}
			ratePlanKey={'Monthly'}
			countryGroupId={GBPCountries}
			thresholdAmount={12}
		/>
	),
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	ratePlanKey: 'Monthly',
	productLabel: 'Digital + print',
	enableCheckList: true,
	amount: 27,
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: [
		...productCatalogDescription.SupporterPlus.benefits.map((benefit) => ({
			isChecked: true,
			text: benefit.copy,
		})),
		...productCatalogDescription.TierThree.benefits.map((benefit) => ({
			isChecked: true,
			text: benefit.copy,
		})),
	],
	tsAndCs: (
		<OrderSummaryTsAndCs
			productKey={'TierThree'}
			ratePlanKey={'Monthly'}
			countryGroupId={GBPCountries}
			thresholdAmount={27}
		/>
	),
	startDate: (
		<OrderSummaryStartDate
			startDate={'Friday, April 11, 2025'}
			productKey="TierThree"
		/>
	),
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
};

export const StudentOneYear = Template.bind({});
StudentOneYear.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'OneYearStudent',
	productLabel: 'All-access Digital',
	paymentFrequency: 'year',
	enableCheckList: true,
	amount: 120,
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: [
		...productCatalogDescription.SupporterPlus.benefits.map((benefit) => ({
			isChecked: true,
			text: benefit.copy,
		})),
	],
	tsAndCs: (
		<OrderSummaryTsAndCs
			productKey={'SupporterPlus'}
			ratePlanKey={'OneYearStudent'}
			countryGroupId={GBPCountries}
			thresholdAmount={9}
		/>
	),
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
	studentDiscount: oneYearStudentDiscount,
};
