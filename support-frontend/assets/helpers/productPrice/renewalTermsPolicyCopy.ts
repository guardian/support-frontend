import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';
import type { Promotion } from './promotions';

const contributionMonthly = (fullPrice: number): string => {
	return `We will attempt to take payment of £${fullPrice}, on the 3rd day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;
};
const digitalAndPrintMonthly = (fullPrice: number): string => {
	return `Subscription auto-renews monthly. Pay £${fullPrice}/month, unless you cancel. We'll remind you every 6 months, 2 weeks before your renewal date.`;
};
const digitalAndPrintAnnual = (fullPrice: number): string => {
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Annual,
	);
	return `Subscription auto-renews annually. Pay £${fullPrice}/year, unless you cancel. Equivalent to £${monthlyEquivalent}/month. We'll remind you every year, 2 weeks before your renewal date.`;
};
const printQuarterly = (fullPrice: number) => {
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Quarterly,
	);
	return `Subscription auto-renews quarterly. Pay £${fullPrice}/quarter, unless you cancel. Equivalent to £${monthlyEquivalent}/month for each quarter. We'll remind you every 6 months, 2 weeks before your renewal date.`;
};

const promotionDigitalMonthly = (
	fullPrice: number,
	promotion: Promotion,
): string => {
	const { discountedPrice, numberOfDiscountedPeriods, expires } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;
	console.log('*** promotion', promotion);
	return `Subscription auto-renews monthly. Pay £${discountedPrice}/month for ${periods} ${
		periods > 1 ? 'months' : 'month'
	}, then £${fullPrice}/month from ${expires}, unless you cancel. We'll remind you 2 weeks before ${expires} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionPrintMonthly = (
	fullPrice: number,
	promotion: Promotion,
): string => {
	const { discountedPrice, numberOfDiscountedPeriods, expires } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;
	const periodName = periods > 1 ? 'months' : 'month';
	return `Subscription auto-renews monthly. Pay £${discountedPrice}/month for the first ${periods} ${periodName}, then £{${fullPrice}}/month from [${expires}], unless you cancel. We'll remind you 2 weeks before ${expires} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionPrintQuarterly = (
	fullPrice: number,
	promotion: Promotion,
): string => {
	const { discountedPrice, numberOfDiscountedPeriods, expires } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;
	const periodName = periods > 1 ? 'quarters' : 'quarter';
	const discountMonthlyEquivalent = monthlyEquivalentPrice(
		discountedPrice ?? 0,
		BillingPeriod.Quarterly,
	);
	return `Subscription auto-renews quarterly. Pay £${discountedPrice}/quarter for ${periods} $${periodName}, then £${fullPrice}/quarter from ${expires}, unless you cancel. Equivalent to £${discountMonthlyEquivalent}/month for ${periods} $${periodName}, then £${fullPrice}/month for each quarter after. We'll remind you 2 weeks before ${expires} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionAnnual = (fullPrice: number, promotion: Promotion): string => {
	const { discountedPrice, numberOfDiscountedPeriods, expires } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;
	const periodName = periods > 1 ? 'years' : 'year';
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Annual,
	);
	const discountMonthlyEquivalent = monthlyEquivalentPrice(
		discountedPrice ?? 0,
		BillingPeriod.Annual,
	);

	return `Subscription auto-renews annually. Pay £${fullPrice}/year for ${periods} $${periodName}, then £${fullPrice}/year from ${expires}, unless you cancel. Equivalent to £${discountMonthlyEquivalent}/month for ${periods} ${periodName}, then ${monthlyEquivalent}/month for each year after. We'll remind you every year, 2 weeks before your renewal date.`;
};
// TODO : Figma matches, is this Observer promotional Copy correct?
const promotionObserverMonthly = (fullPrice: number): string => {
	return `Subscription auto-renews monthly. Pay £${fullPrice}/month, unless you cancel. We'll remind you every 6 months, 2 weeks before your renewal date.`;
};

export type Policy = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, string>>>
>;

function getRenewalTerms(fullPrice: number): Policy {
	return {
		Contribution: {
			Monthly: contributionMonthly(fullPrice),
			Annual: digitalAndPrintAnnual(fullPrice),
		},
		GuardianAdLite: {
			Monthly: digitalAndPrintMonthly(fullPrice),
		},
		SupporterPlus: {
			Monthly: digitalAndPrintMonthly(fullPrice),
			MonthlyTaxExclusive: digitalAndPrintMonthly(fullPrice),
			Annual: digitalAndPrintAnnual(fullPrice),
			AnnualTaxExclusive: digitalAndPrintAnnual(fullPrice),
		},
		DigitalSubscription: {
			Monthly: digitalAndPrintMonthly(fullPrice),
			MonthlyTaxExclusive: digitalAndPrintMonthly(fullPrice),
			Annual: digitalAndPrintAnnual(fullPrice),
			AnnualTaxExclusive: digitalAndPrintAnnual(fullPrice),
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: digitalAndPrintMonthly(fullPrice),
			QuarterlyPlus: printQuarterly(fullPrice),
			AnnualPlus: digitalAndPrintAnnual(fullPrice),
		},
		GuardianWeeklyRestOfWorld: {
			MonthlyPlus: digitalAndPrintMonthly(fullPrice),
			QuarterlyPlus: printQuarterly(fullPrice),
			AnnualPlus: digitalAndPrintAnnual(fullPrice),
		},
		SubscriptionCard: {
			EverydayPlus: digitalAndPrintMonthly(fullPrice),
			SixdayPlus: digitalAndPrintMonthly(fullPrice),
			WeekendPlus: digitalAndPrintMonthly(fullPrice),
			SaturdayPlus: digitalAndPrintMonthly(fullPrice),
			Sunday: digitalAndPrintMonthly(fullPrice),
		},
		HomeDelivery: {
			EverydayPlus: digitalAndPrintMonthly(fullPrice),
			SixdayPlus: digitalAndPrintMonthly(fullPrice),
			WeekendPlus: digitalAndPrintMonthly(fullPrice),
			SaturdayPlus: digitalAndPrintMonthly(fullPrice),
			Sunday: digitalAndPrintMonthly(fullPrice),
		},
	};
}

function getPromotionalRenewalTerms(
	fullPrice: number,
	promotion: Promotion,
): Policy {
	const promotionAnnualTerms = promotionAnnual(fullPrice, promotion);
	const promotionDigitalMonthlyTerms = promotionDigitalMonthly(
		fullPrice,
		promotion,
	);
	const promotionPrintMonthlyTerms = promotionPrintMonthly(
		fullPrice,
		promotion,
	);
	const promotionPrintQuarterlyTerms = promotionPrintQuarterly(
		fullPrice,
		promotion,
	);
	const promotionObserverMonthlyTerms = promotionObserverMonthly(fullPrice);
	return {
		GuardianAdLite: {
			Monthly: promotionDigitalMonthlyTerms,
		},
		SupporterPlus: {
			Monthly: promotionDigitalMonthlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		DigitalSubscription: {
			Monthly: promotionDigitalMonthlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: promotionPrintMonthlyTerms,
			QuarterlyPlus: promotionPrintQuarterlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		GuardianWeeklyRestOfWorld: {
			MonthlyPlus: promotionPrintMonthlyTerms,
			QuarterlyPlus: promotionPrintQuarterlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		SubscriptionCard: {
			EverydayPlus: promotionPrintMonthlyTerms,
			SixdayPlus: promotionPrintMonthlyTerms,
			WeekendPlus: promotionPrintMonthlyTerms,
			SaturdayPlus: promotionPrintMonthlyTerms,
			Sunday: promotionObserverMonthlyTerms,
		},
		HomeDelivery: {
			EverydayPlus: promotionPrintMonthlyTerms,
			SixdayPlus: promotionPrintMonthlyTerms,
			WeekendPlus: promotionPrintMonthlyTerms,
			SaturdayPlus: promotionPrintMonthlyTerms,
			Sunday: promotionObserverMonthlyTerms,
		},
	};
}

export function getRenewalTermsPolicyCopy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion?: Promotion,
) {
	return promotion
		? getPromotionalRenewalTerms(amount, promotion)[productKey]?.[ratePlanKey]
		: getRenewalTerms(amount)[productKey]?.[ratePlanKey];
}
