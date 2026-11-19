import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getPromotionDiscountedPrice } from 'helpers/productPrice/promotionPricing';
import type { PreContractInformationProps } from 'pages/supporter-plus-landing/components/preContractInformation';
import { PreContractInformation } from 'pages/supporter-plus-landing/components/preContractInformation';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Pre Contract Information',
	component: PreContractInformation,
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: PreContractInformationProps) {
	return <PreContractInformation {...args} />;
}

Template.args = {} as Omit<PreContractInformationProps, ''>;

// 2026 : uk test prices
export const getFullPrices = (
	productKey: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
) => {
	return fullPrices[productKey]?.[ratePlan] ?? 0;
};
const fullPrices: Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, number>>>
> = {
	GuardianAdLite: { Monthly: 5 },
	Contribution: { Monthly: 4, Annual: 50 },
	SupporterPlus: { Monthly: 14, Annual: 140, OneYearStudent: 9 },
	DigitalSubscription: { Monthly: 18, Annual: 180 },
	GuardianWeeklyDomestic: {
		MonthlyPlus: 19,
		QuarterlyPlus: 57,
		AnnualPlus: 228,
		OneYearGift: 158.4,
		ThreeMonthGift: 49.5,
	},
	HomeDelivery: {
		EverydayPlus: 88.99,
		SixdayPlus: 77.99,
		WeekendPlus: 36.99,
		SaturdayPlus: 21.99,
		Sunday: 23,
	},
	SubscriptionCard: {
		EverydayPlus: 72.99,
		SixdayPlus: 64.99,
		WeekendPlus: 29.99,
		SaturdayPlus: 16.99,
		Sunday: 18,
	},
};
export const getDiscountPrice = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
) => {
	const fullPrice = getFullPrices(productKey, ratePlanKey);
	const promotion = getPromotions(productKey, ratePlanKey);
	if (!promotion) {
		return fullPrice;
	}
	return getPromotionDiscountedPrice(
		promotion,
		fullPrice,
		ratePlanToBillingPeriod(ratePlanKey),
	);
};

export const promoCatalogDigitalMonthly: PromoWithCatalogInformation = {
	name: 'MONTHLY DIGITAL',
	description: '',
	promoCode: 'MONTHLY DIGITAL',
	isIntroductoryPricing: true,
	discount: {
		amount: 57.12,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogPrintMonthly: PromoWithCatalogInformation = {
	name: 'MONTHLY PRINT 50%',
	description: '',
	promoCode: 'MONTHLY PRINT',
	isIntroductoryPricing: true,
	discount: {
		amount: 50,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogWeeklyQuarterly: PromoWithCatalogInformation = {
	name: 'QUARTERLY 25%',
	description: '',
	promoCode: 'QUARTERLY',
	isIntroductoryPricing: true,
	discount: {
		amount: 25,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogDigitalAnnual: PromoWithCatalogInformation = {
	name: 'ANNUAL',
	description: '',
	promoCode: 'ANNUAL',
	isIntroductoryPricing: true,
	discount: {
		amount: 14.285714,
		durationMonths: 12,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogWeeklyAnnual: PromoWithCatalogInformation = {
	name: 'ANNUAL WEEKLY 25%',
	description: '',
	promoCode: 'ANNUAL WEEKLY',
	isIntroductoryPricing: true,
	discount: {
		amount: 25,
		durationMonths: 12,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};

// 2026 : uk test promotions
export const getPromotions = (
	productKey: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
): PromoWithCatalogInformation | undefined => {
	return promotions[productKey]?.[ratePlan];
};
const promotions: Partial<
	Record<
		ActiveProductKey,
		Partial<Record<ActiveRatePlanKey, PromoWithCatalogInformation>>
	>
> = {
	GuardianAdLite: { Monthly: promoCatalogDigitalMonthly },
	SupporterPlus: {
		Monthly: promoCatalogDigitalMonthly,
		Annual: promoCatalogDigitalAnnual,
	},
	DigitalSubscription: {
		Monthly: promoCatalogDigitalMonthly,
		Annual: promoCatalogDigitalAnnual,
	},
	GuardianWeeklyDomestic: {
		MonthlyPlus: promoCatalogPrintMonthly,
		QuarterlyPlus: promoCatalogWeeklyQuarterly,
		AnnualPlus: promoCatalogWeeklyAnnual,
	},
	HomeDelivery: {
		EverydayPlus: promoCatalogPrintMonthly,
		SixdayPlus: promoCatalogPrintMonthly,
		WeekendPlus: promoCatalogPrintMonthly,
		SaturdayPlus: promoCatalogPrintMonthly,
		Sunday: promoCatalogPrintMonthly,
	},
	SubscriptionCard: {
		EverydayPlus: promoCatalogPrintMonthly,
		SixdayPlus: promoCatalogPrintMonthly,
		WeekendPlus: promoCatalogPrintMonthly,
		SaturdayPlus: promoCatalogPrintMonthly,
		Sunday: promoCatalogPrintMonthly,
	},
};

export const GuardianAdLiteMonthly = Template.bind({});
GuardianAdLiteMonthly.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('GuardianAdLite', 'Monthly'),
};

export const GuardianAdLiteMonthlyWithPromotion = Template.bind({});
GuardianAdLiteMonthlyWithPromotion.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('GuardianAdLite', 'Monthly'),
	promotion: getPromotions('GuardianAdLite', 'Monthly'),
};

export const ContributionMonthly = Template.bind({});
ContributionMonthly.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('Contribution', 'Monthly'),
};

export const ContributionAnnual = Template.bind({});
ContributionAnnual.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Annual',
	amount: getFullPrices('Contribution', 'Annual'),
};

export const SupporterPlusMonthly = Template.bind({});
SupporterPlusMonthly.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('SupporterPlus', 'Monthly'),
};

export const SupporterPlusMonthlyWithPromotion = Template.bind({});
SupporterPlusMonthlyWithPromotion.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('SupporterPlus', 'Monthly'),
	promotion: getPromotions('SupporterPlus', 'Monthly'),
};

export const SupporterPlusMonthlyWithContribution = Template.bind({});
SupporterPlusMonthlyWithContribution.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('SupporterPlus', 'Monthly'),
	contribution: 5,
};

export const SupporterPlusAnnual = Template.bind({});
SupporterPlusAnnual.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Annual',
	amount: getFullPrices('SupporterPlus', 'Annual'),
};

export const SupporterPlusAnnualWithPromotion = Template.bind({});
SupporterPlusAnnualWithPromotion.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Annual',
	amount: getFullPrices('SupporterPlus', 'Annual'),
	promotion: getPromotions('SupporterPlus', 'Annual'),
};

export const SupporterPlusOneYearStudent = Template.bind({});
SupporterPlusOneYearStudent.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'OneYearStudent',
	amount: getFullPrices('SupporterPlus', 'OneYearStudent'),
};

export const DigitalSubscriptionMonthly = Template.bind({});
DigitalSubscriptionMonthly.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('DigitalSubscription', 'Monthly'),
};

export const DigitalSubscriptionMonthlyWithPromotion = Template.bind({});
DigitalSubscriptionMonthlyWithPromotion.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	amount: getFullPrices('DigitalSubscription', 'Monthly'),
	promotion: getPromotions('DigitalSubscription', 'Monthly'),
};

export const DigitalSubscriptionAnnual = Template.bind({});
DigitalSubscriptionAnnual.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Annual',
	amount: getFullPrices('DigitalSubscription', 'Annual'),
};

export const DigitalSubscriptionAnnualWithPromotion = Template.bind({});
DigitalSubscriptionAnnualWithPromotion.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Annual',
	amount: getFullPrices('DigitalSubscription', 'Annual'),
	promotion: getPromotions('DigitalSubscription', 'Annual'),
};

export const GuardianWeeklyDomesticMonthly = Template.bind({});
GuardianWeeklyDomesticMonthly.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'MonthlyPlus',
	amount: getFullPrices('GuardianWeeklyDomestic', 'MonthlyPlus'),
};

export const GuardianWeeklyDomesticMonthlyWithPromotion = Template.bind({});
GuardianWeeklyDomesticMonthlyWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'MonthlyPlus',
	amount: getFullPrices('GuardianWeeklyDomestic', 'MonthlyPlus'),
	promotion: getPromotions('GuardianWeeklyDomestic', 'MonthlyPlus'),
};

export const GuardianWeeklyDomesticQuarterly = Template.bind({});
GuardianWeeklyDomesticQuarterly.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'QuarterlyPlus',
	amount: getFullPrices('GuardianWeeklyDomestic', 'QuarterlyPlus'),
};

export const GuardianWeeklyDomesticQuarterlyWithPromotion = Template.bind({});
GuardianWeeklyDomesticQuarterlyWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'QuarterlyPlus',
	amount: getFullPrices('GuardianWeeklyDomestic', 'QuarterlyPlus'),
	promotion: getPromotions('GuardianWeeklyDomestic', 'QuarterlyPlus'),
};

export const GuardianWeeklyDomesticAnnual = Template.bind({});
GuardianWeeklyDomesticAnnual.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'AnnualPlus',
	amount: getFullPrices('GuardianWeeklyDomestic', 'AnnualPlus'),
};

export const GuardianWeeklyDomesticAnnualWithPromotion = Template.bind({});
GuardianWeeklyDomesticAnnualWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'AnnualPlus',
	amount: getFullPrices('GuardianWeeklyDomestic', 'AnnualPlus'),
	promotion: getPromotions('GuardianWeeklyDomestic', 'AnnualPlus'),
};

export const GuardianWeeklyDomesticThreeMonthGift = Template.bind({});
GuardianWeeklyDomesticThreeMonthGift.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'ThreeMonthGift',
	amount: getFullPrices('GuardianWeeklyDomestic', 'ThreeMonthGift'),
};

export const GuardianWeeklyDomesticOneYearGift = Template.bind({});
GuardianWeeklyDomesticOneYearGift.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'OneYearGift',
	amount: getFullPrices('GuardianWeeklyDomestic', 'OneYearGift'),
};

export const HomeDeliveryEverydayPlus = Template.bind({});
HomeDeliveryEverydayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
	amount: getFullPrices('HomeDelivery', 'EverydayPlus'),
};

export const HomeDeliveryEverydayPlusWithPromotion = Template.bind({});
HomeDeliveryEverydayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
	amount: getFullPrices('HomeDelivery', 'EverydayPlus'),
	promotion: getPromotions('HomeDelivery', 'EverydayPlus'),
};

export const HomeDeliverySixdayPlus = Template.bind({});
HomeDeliverySixdayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	amount: getFullPrices('HomeDelivery', 'SixdayPlus'),
};

export const HomeDeliverySixdayPlusWithPromotion = Template.bind({});
HomeDeliverySixdayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	amount: getFullPrices('HomeDelivery', 'SixdayPlus'),
	promotion: getPromotions('HomeDelivery', 'SixdayPlus'),
};

export const HomeDeliveryWeekendPlus = Template.bind({});
HomeDeliveryWeekendPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'WeekendPlus',
	amount: getFullPrices('HomeDelivery', 'WeekendPlus'),
};

export const HomeDeliveryWeekendPlusWithPromotion = Template.bind({});
HomeDeliveryWeekendPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'WeekendPlus',
	amount: getFullPrices('HomeDelivery', 'WeekendPlus'),
	promotion: getPromotions('HomeDelivery', 'WeekendPlus'),
};

export const HomeDeliverySaturdayPlus = Template.bind({});
HomeDeliverySaturdayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SaturdayPlus',
	amount: getFullPrices('HomeDelivery', 'SaturdayPlus'),
};

export const HomeDeliverySaturdayPlusWithPromotion = Template.bind({});
HomeDeliverySaturdayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SaturdayPlus',
	amount: getFullPrices('HomeDelivery', 'SaturdayPlus'),
	promotion: getPromotions('HomeDelivery', 'SaturdayPlus'),
};

export const HomeDeliverySunday = Template.bind({});
HomeDeliverySunday.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Sunday',
	amount: getFullPrices('HomeDelivery', 'Sunday'),
};

export const HomeDeliverySundayWithPromotion = Template.bind({});
HomeDeliverySundayWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Sunday',
	amount: getFullPrices('HomeDelivery', 'Sunday'),
	promotion: getPromotions('HomeDelivery', 'Sunday'),
};

export const SubscriptionCardEverydayPlus = Template.bind({});
SubscriptionCardEverydayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'EverydayPlus',
	amount: getFullPrices('SubscriptionCard', 'EverydayPlus'),
};

export const SubscriptionCardEverydayPlusWithPromotion = Template.bind({});
SubscriptionCardEverydayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'EverydayPlus',
	amount: getFullPrices('SubscriptionCard', 'EverydayPlus'),
	promotion: getPromotions('SubscriptionCard', 'EverydayPlus'),
};

export const SubscriptionCardSixdayPlus = Template.bind({});
SubscriptionCardSixdayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SixdayPlus',
	amount: getFullPrices('SubscriptionCard', 'SixdayPlus'),
};

export const SubscriptionCardSixdayPlusWithPromotion = Template.bind({});
SubscriptionCardSixdayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SixdayPlus',
	amount: getFullPrices('SubscriptionCard', 'SixdayPlus'),
	promotion: getPromotions('SubscriptionCard', 'SixdayPlus'),
};

export const SubscriptionCardWeekendPlus = Template.bind({});
SubscriptionCardWeekendPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	amount: getFullPrices('SubscriptionCard', 'WeekendPlus'),
};

export const SubscriptionCardWeekendPlusWithPromotion = Template.bind({});
SubscriptionCardWeekendPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	amount: getFullPrices('SubscriptionCard', 'WeekendPlus'),
	promotion: getPromotions('SubscriptionCard', 'WeekendPlus'),
};

export const SubscriptionCardSaturdayPlus = Template.bind({});
SubscriptionCardSaturdayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SaturdayPlus',
	amount: getFullPrices('SubscriptionCard', 'SaturdayPlus'),
};

export const SubscriptionCardSaturdayPlusWithPromotion = Template.bind({});
SubscriptionCardSaturdayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SaturdayPlus',
	amount: getFullPrices('SubscriptionCard', 'SaturdayPlus'),
	promotion: getPromotions('SubscriptionCard', 'SaturdayPlus'),
};

export const SubscriptionCardSunday = Template.bind({});
SubscriptionCardSunday.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Sunday',
	amount: getFullPrices('SubscriptionCard', 'Sunday'),
};

export const SubscriptionCardSundayWithPromotion = Template.bind({});
SubscriptionCardSundayWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Sunday',
	amount: getFullPrices('SubscriptionCard', 'Sunday'),
	promotion: getPromotions('SubscriptionCard', 'Sunday'),
};
