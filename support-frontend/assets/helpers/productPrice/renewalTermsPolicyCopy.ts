import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';
import type { Promotion } from './promotions';

const contributionMonthly = (amount: number): string => {
	return `We will attempt to take payment of £${amount}, on the 3rd day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;
};
const digitalAndPrintMonthly = (amount: number): string => {
	return `Subscription auto-renews monthly. Pay £${amount}/month, unless you cancel. We'll remind you every 6 months, 2 weeks before your renewal date.`;
};
const digitalAndPrintAnnual = (amount: number): string => {
	const monthlyEquivalent = monthlyEquivalentPrice(
		amount,
		BillingPeriod.Annual,
	);
	return `Subscription auto-renews annually. Pay £${amount}/year, unless you cancel. Equivalent to £${monthlyEquivalent}/month. We'll remind you every year, 2 weeks before your renewal date.`;
};
const printQuarterly = (amount: number) => {
	const monthlyEquivalent = monthlyEquivalentPrice(
		amount,
		BillingPeriod.Quarterly,
	);
	return `Subscription auto-renews quarterly. Pay £${amount}/quarter, unless you cancel. Equivalent to £${monthlyEquivalent}/month for each quarter. We'll remind you every 6 months, 2 weeks before your renewal date.`;
};

const promotionDigitalMonthly = (
	amount: number,
	promotion: Promotion,
): string => {
	const { numberOfDiscountedPeriods, expires } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;
	return `Subscription auto-renews monthly. Pay £${amount}/month for ${periods} [$${
		periods > 1 ? 'months' : 'month'
	}], then £{${amount}}/month from [${expires}], unless you cancel. We'll remind you 2 weeks before ${expires} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionPrintMonthly = (
	amount: number,
	promotion: Promotion,
): string => {
	const { numberOfDiscountedPeriods, expires } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;

	return `Subscription auto-renews monthly. Pay £${amount}/month for the first ${periods} [$${
		periods > 1 ? 'months' : 'month'
	}], then £{${amount}}/month from [${expires}], unless you cancel. We'll remind you 2 weeks before ${expires} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionPrintQuarterly = (
	amount: number,
	promotion: Promotion,
): string => {
	const { numberOfDiscountedPeriods, expires, discountedPrice } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;
	const periodName = periods > 1 ? 'quarters' : 'quarter';
	const discountMonthlyEquivalent = monthlyEquivalentPrice(
		discountedPrice ?? 0,
		BillingPeriod.Quarterly,
	);

	return `Subscription auto-renews quarterly. Pay £${amount}/quarter for ${periods} $${periodName}, then £${amount}/quarter from ${expires}, unless you cancel. Equivalent to £${discountMonthlyEquivalent}/month for ${periods} $${periodName}, then £${amount}/month for each quarter after. We'll remind you 2 weeks before ${expires} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionAnnual = (amount: number, promotion: Promotion): string => {
	const { numberOfDiscountedPeriods, expires, discountedPrice } = promotion;
	const periods = numberOfDiscountedPeriods ?? 1;
	const periodName = periods > 1 ? 'years' : 'year';
	const monthlyEquivalent = monthlyEquivalentPrice(
		amount,
		BillingPeriod.Annual,
	);
	const discountMonthlyEquivalent = monthlyEquivalentPrice(
		discountedPrice ?? 0,
		BillingPeriod.Annual,
	);

	return `Subscription auto-renews annually. Pay £${amount}/year for ${periods} $${periodName}, then £${amount}/year from ${expires}, unless you cancel. Equivalent to £${discountMonthlyEquivalent}/month for ${periods} ${periodName}, then ${monthlyEquivalent}/month for each year after. We'll remind you every year, 2 weeks before your renewal date.`;
};
// TODO : Figma matches, is this Observer promotional Copy correct?
const promotionObserverMonthly = (amount: number): string => {
	return `Subscription auto-renews monthly. Pay £${amount}/month, unless you cancel. We'll remind you every 6 months, 2 weeks before your renewal date.`;
};

export type Policy = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, string>>>
>;

function getRenewalTerms(amount: number): Policy {
	return {
		Contribution: {
			Monthly: contributionMonthly(amount),
			Annual: digitalAndPrintAnnual(amount),
		},
		GuardianAdLite: {
			Monthly: digitalAndPrintMonthly(amount),
		},
		SupporterPlus: {
			Monthly: digitalAndPrintMonthly(amount),
			MonthlyTaxExclusive: digitalAndPrintMonthly(amount),
			Annual: digitalAndPrintAnnual(amount),
			AnnualTaxExclusive: digitalAndPrintAnnual(amount),
		},
		DigitalSubscription: {
			Monthly: digitalAndPrintMonthly(amount),
			MonthlyTaxExclusive: digitalAndPrintMonthly(amount),
			Annual: digitalAndPrintAnnual(amount),
			AnnualTaxExclusive: digitalAndPrintAnnual(amount),
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: digitalAndPrintMonthly(amount),
			QuarterlyPlus: printQuarterly(amount),
			AnnualPlus: digitalAndPrintAnnual(amount),
		},
		GuardianWeeklyRestOfWorld: {
			MonthlyPlus: digitalAndPrintMonthly(amount),
			QuarterlyPlus: printQuarterly(amount),
			AnnualPlus: digitalAndPrintAnnual(amount),
		},
		SubscriptionCard: {
			EverydayPlus: digitalAndPrintMonthly(amount),
			SixdayPlus: digitalAndPrintMonthly(amount),
			WeekendPlus: digitalAndPrintMonthly(amount),
			SaturdayPlus: digitalAndPrintMonthly(amount),
			Sunday: digitalAndPrintMonthly(amount),
		},
		HomeDelivery: {
			EverydayPlus: digitalAndPrintMonthly(amount),
			SixdayPlus: digitalAndPrintMonthly(amount),
			WeekendPlus: digitalAndPrintMonthly(amount),
			SaturdayPlus: digitalAndPrintMonthly(amount),
			Sunday: digitalAndPrintMonthly(amount),
		},
	};
}

function getPromotionRenewalTerms(
	renewalTerms: Policy,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion: Promotion,
) {
	const promotionAnnualTerms = promotionAnnual(amount, promotion);
	const promotionDigitalMonthlyTerms = promotionDigitalMonthly(
		amount,
		promotion,
	);
	const promotionPrintMonthlyTerms = promotionPrintMonthly(amount, promotion);
	const promotionPrintQuarterlyTerms = promotionPrintQuarterly(
		amount,
		promotion,
	);
	const promotionObserverMonthlyTerms = promotionObserverMonthly(amount);
	const promotionRenewalTerms = {
		...renewalTerms,
		Contribution: {
			...renewalTerms.Contribution,
			Monthly: '',
		},
		GuardianAdLite: {
			...renewalTerms.GuardianAdLite,
			Monthly: promotionDigitalMonthlyTerms,
		},
		SupporterPlus: {
			...renewalTerms.SupporterPlus,
			Monthly: promotionDigitalMonthlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		DigitalSubscription: {
			...renewalTerms.DigitalSubscription,
			Monthly: promotionDigitalMonthlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		GuardianWeeklyDomestic: {
			...renewalTerms.GuardianWeeklyDomestic,
			MonthlyPlus: promotionPrintMonthlyTerms,
			QuarterlyPlus: promotionPrintQuarterlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		GuardianWeeklyRestOfWorld: {
			...renewalTerms.GuardianWeeklyRestOfWorld,
			MonthlyPlus: promotionPrintMonthlyTerms,
			QuarterlyPlus: promotionPrintQuarterlyTerms,
			AnnualPlus: promotionAnnualTerms,
		},
		SubscriptionCard: {
			...renewalTerms.SubscriptionCard,
			EverydayPlus: promotionPrintMonthlyTerms,
			SixdayPlus: promotionPrintMonthlyTerms,
			WeekendPlus: promotionPrintMonthlyTerms,
			SaturdayPlus: promotionPrintMonthlyTerms,
			Sunday: promotionObserverMonthlyTerms,
		},
		HomeDelivery: {
			...renewalTerms.HomeDelivery,
			EverydayPlus: promotionPrintMonthlyTerms,
			SixdayPlus: promotionPrintMonthlyTerms,
			WeekendPlus: promotionPrintMonthlyTerms,
			SaturdayPlus: promotionPrintMonthlyTerms,
			Sunday: promotionObserverMonthlyTerms,
		},
	};
	return promotionRenewalTerms[productKey]?.[ratePlanKey];
}

export function getRenewalTermsPolicyCopy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion?: Promotion,
) {
	const renewalTerms = getRenewalTerms(amount);
	return promotion
		? getPromotionRenewalTerms(
				renewalTerms,
				productKey,
				ratePlanKey,
				amount,
				promotion,
		  )
		: renewalTerms[productKey]?.[ratePlanKey];
}
