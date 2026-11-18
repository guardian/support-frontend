import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import { getProductFirstDeliveryDate } from 'pages/[countryGroupId]/checkout/helpers/deliveryDays';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';

export const getPromotionExpiryDate = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	durationMonths: number,
): Date => {
	const startDate =
		getProductFirstDeliveryDate(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		) ?? new Date();
	const promotionExpiryDate = new Date(
		startDate.setMonth(startDate.getMonth() + durationMonths),
	);
	return promotionExpiryDate;
};

const contributionMonthly = (fullPrice: number): string => {
	return `We will attempt to take payment of £${fullPrice}, on the ${getDateWithOrdinal(
		new Date(),
	)} day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;
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
	promotionExpiry: Date,
	promotion: PromoWithCatalogInformation,
): string => {
	const { discount } = promotion;
	if (!discount) {
		return digitalAndPrintMonthly(fullPrice);
	}
	const { amount: discountedPrice, durationMonths } = discount;
	const periodName = durationMonths > 1 ? 'months' : 'month';
	const expiry = formatUserDate(promotionExpiry);
	return `Subscription auto-renews monthly. Pay £${discountedPrice}/month for ${durationMonths} ${periodName}, then £${fullPrice}/month from ${expiry}, unless you cancel. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionPrintMonthly = (
	fullPrice: number,
	promotionExpiry: Date,
	promotion: PromoWithCatalogInformation,
): string => {
	const { discount } = promotion;
	if (!discount) {
		return digitalAndPrintMonthly(fullPrice);
	}
	const { amount: discountedPrice, durationMonths } = discount;
	const periodName = durationMonths > 1 ? 'months' : 'month';
	const expiry = formatUserDate(promotionExpiry);
	return `Subscription auto-renews monthly. Pay £${discountedPrice}/month for the first ${durationMonths} ${periodName}, then £${fullPrice}/month from ${expiry}, unless you cancel. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionPrintQuarterly = (
	fullPrice: number,
	promotionExpiry: Date,
	promotion: PromoWithCatalogInformation,
): string => {
	const { discount } = promotion;
	if (!discount) {
		return printQuarterly(fullPrice);
	}
	const { amount: discountedPrice, durationMonths } = discount;
	const durationQuarters = durationMonths / 3;
	const periodName = durationQuarters > 1 ? 'quarters' : 'quarter';
	const expiry = formatUserDate(promotionExpiry);
	const discountMonthlyEquivalent = monthlyEquivalentPrice(
		discountedPrice,
		BillingPeriod.Quarterly,
	);
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Quarterly,
	);
	return `Subscription auto-renews quarterly. Pay £${discountedPrice}/quarter for ${durationQuarters} ${periodName}, then £${fullPrice}/quarter from ${expiry}, unless you cancel. Equivalent to £${discountMonthlyEquivalent}/month for ${durationQuarters} ${periodName}, then £${monthlyEquivalent}/month for each quarter after. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionAnnual = (
	fullPrice: number,
	promotionExpiry: Date,
	promotion: PromoWithCatalogInformation,
): string => {
	const { discount } = promotion;
	if (!discount) {
		return digitalAndPrintAnnual(fullPrice);
	}
	const { amount: discountedPrice, durationMonths } = discount;
	const durationAnnual = durationMonths / 12;
	const periodName = durationAnnual > 1 ? 'years' : 'year';
	const expiry = formatUserDate(promotionExpiry);
	const discountMonthlyEquivalent = monthlyEquivalentPrice(
		discountedPrice,
		BillingPeriod.Annual,
	);
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Annual,
	);
	return `Subscription auto-renews annually. Pay £${discountedPrice}/year for ${durationAnnual} ${periodName}, then £${fullPrice}/year from ${expiry}, unless you cancel. Equivalent to £${discountMonthlyEquivalent}/month for ${durationAnnual} ${periodName}, then £${monthlyEquivalent}/month for each year after. We'll remind you every year, 2 weeks before your renewal date.`;
};

type Policy = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, string>>>
>;

function getRenewalTerm(fullPrice: number): Policy {
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

function getPromotionalRenewalTerm(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
	promotion: PromoWithCatalogInformation,
): Policy {
	const promotionExpiryDate = getPromotionExpiryDate(
		productKey,
		ratePlanKey,
		promotion.discount?.durationMonths ?? 0,
	);
	const promotionAnnualTerms = promotionAnnual(
		fullPrice,
		promotionExpiryDate,
		promotion,
	);
	const promotionDigitalMonthlyTerms = promotionDigitalMonthly(
		fullPrice,
		promotionExpiryDate,
		promotion,
	);
	const promotionPrintMonthlyTerms = promotionPrintMonthly(
		fullPrice,
		promotionExpiryDate,
		promotion,
	);
	const promotionPrintQuarterlyTerms = promotionPrintQuarterly(
		fullPrice,
		promotionExpiryDate,
		promotion,
	);
	return {
		GuardianAdLite: {
			Monthly: promotionDigitalMonthlyTerms,
		},
		SupporterPlus: {
			Monthly: promotionDigitalMonthlyTerms,
			MonthlyTaxExclusive: promotionDigitalMonthlyTerms,
			Annual: promotionAnnualTerms,
			AnnualTaxExclusive: promotionAnnualTerms,
		},
		DigitalSubscription: {
			Monthly: promotionDigitalMonthlyTerms,
			MonthlyTaxExclusive: promotionDigitalMonthlyTerms,
			Annual: promotionAnnualTerms,
			AnnualTaxExclusive: promotionAnnualTerms,
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
		HomeDelivery: {
			EverydayPlus: promotionPrintMonthlyTerms,
			SixdayPlus: promotionPrintMonthlyTerms,
			WeekendPlus: promotionPrintMonthlyTerms,
			SaturdayPlus: promotionPrintMonthlyTerms,
			Sunday: promotionPrintMonthlyTerms,
		},
		SubscriptionCard: {
			EverydayPlus: promotionPrintMonthlyTerms,
			SixdayPlus: promotionPrintMonthlyTerms,
			WeekendPlus: promotionPrintMonthlyTerms,
			SaturdayPlus: promotionPrintMonthlyTerms,
			Sunday: promotionPrintMonthlyTerms,
		},
	};
}

export function getRenewalTermPolicy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
	promotion?: PromoWithCatalogInformation,
) {
	const isValidPromotion = promotion?.discount?.amount !== undefined;
	return isValidPromotion
		? getPromotionalRenewalTerm(productKey, ratePlanKey, fullPrice, promotion)[
				productKey
		  ]?.[ratePlanKey]
		: getRenewalTerm(fullPrice)[productKey]?.[ratePlanKey];
}
