import { css } from '@emotion/react';
import { Button, Column, Columns } from '@guardian/source/react-components';
import {
	Canada,
	SupportRegionId,
} from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { ContributionsOrderSummaryProps } from 'components/orderSummary/contributionsOrderSummary';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import { OrderSummaryStartDate } from 'components/orderSummary/orderSummaryStartDate';
import { OrderSummaryTsAndCs } from 'components/orderSummary/orderSummaryTsAndCs';
import {
	getProductLabel,
	productCatalogDescription,
} from 'helpers/productCatalog';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';
import { fallBackLandingPageSelection } from '../../assets/helpers/abTests/landingPageAbTests';

const boldText = css`
	font-weight: bold;
`;

const landingPageSettings = fallBackLandingPageSelection;

const weeklyPricingLandingPageSettings = {
	...fallBackLandingPageSelection,
	name: 'WEEKLY_PRICE_TEST',
};

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

enum ProductKeys {
	Contribution = 'Contribution',
	SupporterPlusKey = 'SupporterPlus',
	DigitalSubscription = 'DigitalSubscription',
}

export default {
	title: 'Checkouts/Contributions Order Summary',
	component: ContributionsOrderSummary,
	argTypes: {
		onCheckListToggle: { action: 'accordion clicked' },
		tsAndCs: { table: { disable: true } },
		headerButton: { table: { disable: true } },
	},
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
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	productLabel: 'Monthly support',
	billingPeriod: BillingPeriod.Monthly,
	enableCheckList: true,
	payment: { originalAmount: 10, finalAmount: 10 },
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		spokenCurrency: 'pound',
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
	supportRegionId: SupportRegionId.UK,
	landingPageSettings,
	taxRateConfig: { type: 'tax_inclusive' },
};

export const RecurringContribution = Template.bind({});
RecurringContribution.args = {
	productKey: ProductKeys.Contribution,
	ratePlanKey: 'Monthly',
	productLabel: getProductLabel(ProductKeys.Contribution),
	billingPeriod: BillingPeriod.Monthly,
	enableCheckList: true,
	payment: { originalAmount: 3, finalAmount: 3 },
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		spokenCurrency: 'pound',
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
	supportRegionId: SupportRegionId.UK,
	landingPageSettings,
	taxRateConfig: { type: 'tax_inclusive' },
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: ProductKeys.SupporterPlusKey,
	ratePlanKey: 'Monthly',
	billingPeriod: BillingPeriod.Monthly,
	productLabel: getProductLabel(ProductKeys.SupporterPlusKey),
	enableCheckList: true,
	payment: { originalAmount: 12, finalAmount: 12 },
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		spokenCurrency: 'pound',
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
	supportRegionId: SupportRegionId.UK,
	landingPageSettings,
	taxRateConfig: { type: 'tax_inclusive' },
};

export const SupporterPlusWithTax = Template.bind({});
SupporterPlusWithTax.args = {
	productKey: ProductKeys.SupporterPlusKey,
	ratePlanKey: 'MonthlyTaxExclusive',
	billingPeriod: BillingPeriod.Monthly,
	productLabel: getProductLabel(ProductKeys.SupporterPlusKey),
	enableCheckList: true,
	payment: { originalAmount: 15, finalAmount: 15 },
	currency: {
		glyph: '$',
		extendedGlyph: 'CA$',
		spokenCurrency: 'dollar',
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
			countryGroupId={Canada}
			thresholdAmount={15}
		/>
	),
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
	supportRegionId: SupportRegionId.CA,
	landingPageSettings,
	taxRateConfig: { type: 'tax_exclusive', rate: 0.15 },
};

export const DigitalPlusWithTaxAndDiscount = Template.bind({});
DigitalPlusWithTaxAndDiscount.args = {
	productKey: ProductKeys.DigitalSubscription,
	ratePlanKey: 'MonthlyTaxExclusive',
	billingPeriod: BillingPeriod.Monthly,
	productLabel: getProductLabel(ProductKeys.DigitalSubscription),
	enableCheckList: true,
	payment: { finalAmount: 15, originalAmount: 30 },
	currency: {
		glyph: '$',
		extendedGlyph: 'CA$',
		spokenCurrency: 'dollar',
	},
	promotion: {
		name: 'Digital Plus Promo',
		description: '50% off for six months',
		promoCode: 'TEST_PROMO',
		discountedPrice: 15,
		discount: {
			amount: 50,
			durationMonths: 6,
		},
		isIntroductoryPricing: false,
	},
	checkListData: [
		...productCatalogDescription.DigitalSubscription.benefits.map(
			(benefit) => ({
				isChecked: true,
				text: benefit.copy,
			}),
		),
	],
	tsAndCs: (
		<OrderSummaryTsAndCs
			productKey={'DigitalSubscription'}
			ratePlanKey={'Monthly'}
			countryGroupId={Canada}
		/>
	),
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
	supportRegionId: SupportRegionId.CA,
	landingPageSettings,
	taxRateConfig: { type: 'tax_exclusive', rate: 0.15 },
};

export const DigitalSubscription = Template.bind({});
DigitalSubscription.args = {
	productKey: ProductKeys.DigitalSubscription,
	ratePlanKey: 'Monthly',
	billingPeriod: BillingPeriod.Monthly,
	productLabel: getProductLabel(ProductKeys.DigitalSubscription),
	enableCheckList: true,
	payment: { originalAmount: 27, finalAmount: 27 },
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		spokenCurrency: 'pound',
	},
	checkListData: [
		...productCatalogDescription.DigitalSubscription.benefits.map(
			(benefit) => ({
				isChecked: true,
				text: benefit.copy,
			}),
		),
	],
	tsAndCs: (
		<OrderSummaryTsAndCs
			productKey={'DigitalSubscription'}
			ratePlanKey={'Monthly'}
			countryGroupId={GBPCountries}
			thresholdAmount={27}
		/>
	),
	startDate: (
		<OrderSummaryStartDate
			productKey="DigitalSubscription"
			ratePlanKey={'Monthly'}
			startDate={'Friday, April 11, 2025'}
		/>
	),
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
	supportRegionId: SupportRegionId.UK,
	landingPageSettings,
	taxRateConfig: { type: 'tax_inclusive' },
};

export const StudentOneYear = Template.bind({});
StudentOneYear.args = {
	productKey: ProductKeys.SupporterPlusKey,
	ratePlanKey: 'OneYearStudent',
	productLabel: getProductLabel(ProductKeys.SupporterPlusKey),
	billingPeriod: BillingPeriod.Annual,
	enableCheckList: true,
	payment: { originalAmount: 9, finalAmount: 9 },
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		spokenCurrency: 'pound',
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
	supportRegionId: SupportRegionId.UK,
	landingPageSettings,
	taxRateConfig: { type: 'tax_inclusive' },
};

export const WeeklyPricing = Template.bind({});
WeeklyPricing.args = {
	productKey: ProductKeys.SupporterPlusKey,
	ratePlanKey: 'Monthly',
	productLabel: getProductLabel(ProductKeys.SupporterPlusKey),
	billingPeriod: BillingPeriod.Monthly,
	enableCheckList: true,
	payment: { originalAmount: 12, finalAmount: 12 },
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		spokenCurrency: 'pound',
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
	supportRegionId: SupportRegionId.UK,
	landingPageSettings: weeklyPricingLandingPageSettings,
	taxRateConfig: { type: 'tax_inclusive' },
};

export const WeeklyPricingWithPromotion = Template.bind({});
WeeklyPricingWithPromotion.args = {
	productKey: ProductKeys.SupporterPlusKey,
	ratePlanKey: 'Monthly',
	productLabel: getProductLabel(ProductKeys.SupporterPlusKey),
	billingPeriod: BillingPeriod.Monthly,
	enableCheckList: true,
	payment: { originalAmount: 12, finalAmount: 8 },
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		spokenCurrency: 'pound',
	},
	checkListData: [
		...productCatalogDescription.SupporterPlus.benefits.map((benefit) => ({
			isChecked: true,
			text: benefit.copy,
		})),
	],
	promotion: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: 'TEST_PROMO',
		discountedPrice: 8,
		discount: {
			amount: 33,
			durationMonths: 6,
		},
		isIntroductoryPricing: false,
	},
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
	supportRegionId: SupportRegionId.UK,
	landingPageSettings: weeklyPricingLandingPageSettings,
	taxRateConfig: { type: 'tax_inclusive' },
};

export const WeeklyPricingWithTax = Template.bind({});
WeeklyPricingWithTax.args = {
	productKey: ProductKeys.SupporterPlusKey,
	ratePlanKey: 'Monthly',
	productLabel: getProductLabel(ProductKeys.SupporterPlusKey),
	billingPeriod: BillingPeriod.Monthly,
	enableCheckList: true,
	payment: { originalAmount: 15, finalAmount: 15 },
	currency: {
		glyph: '$',
		extendedGlyph: 'CA$',
		spokenCurrency: 'dollar',
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
			countryGroupId={Canada}
			thresholdAmount={15}
		/>
	),
	startDate: null,
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
	supportRegionId: SupportRegionId.CA,
	landingPageSettings: weeklyPricingLandingPageSettings,
	taxRateConfig: { type: 'tax_exclusive', rate: 0.15 },
};
