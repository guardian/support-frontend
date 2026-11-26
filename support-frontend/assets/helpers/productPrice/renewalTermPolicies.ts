import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import {
	addDays,
	getProductFirstDeliveryDate,
} from 'pages/[countryGroupId]/checkout/helpers/deliveryDays';
import {
	getBillingPeriodNoun,
	getNumberOfMonthsInPeriod,
	ratePlanToBillingPeriod,
} from './billingPeriods';
import type { PromoDiscount } from './discountedPrice';
import {
	getDiscountedPrice,
	getNumberOfDiscountedPeriods,
} from './discountedPrice';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';

// PaymentTsAndCs implies a 15day wait for digitalSubscriptions alongside GuardianAdLite
const getFirstDeliveryDateInclDigitalSubscription = (
	productKey: ActiveProductKey,
	paperProductOptions?: ActivePaperProductOptions,
): Date | undefined => {
	if (productKey === 'DigitalSubscription') {
		return addDays(new Date(), 15);
	} else {
		return getProductFirstDeliveryDate(productKey, paperProductOptions);
	}
};

export const getPromotionExpiryDate = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	durationMonths: number,
): Date => {
	const promotionExpiryDate =
		getFirstDeliveryDateInclDigitalSubscription(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		) ?? new Date();

	// current day of this month
	const dayOfMonth = promotionExpiryDate.getDate();

	// last day of proposed month
	promotionExpiryDate.setDate(1);
	promotionExpiryDate.setMonth(promotionExpiryDate.getMonth() + durationMonths);
	const lastDayOfMonth = new Date(
		promotionExpiryDate.getFullYear(),
		promotionExpiryDate.getMonth() + 1,
		0,
	).getDate();

	// accept lower of last day or current day
	promotionExpiryDate.setDate(Math.min(lastDayOfMonth, dayOfMonth));
	return promotionExpiryDate;
};

const contributionMonthly = (fullPrice: number): string => {
	return `This payment auto-renews monthly until you cancel. You can cancel your auto-renewal at any time. We will attempt to take payment of £${fullPrice}, on the ${getDateWithOrdinal(
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

type RenewalTermDetailProps = {
	discountedPrice: number;
	durationPeriods: number;
	periodName: string;
	expiry: string;
	discountMonthlyEquivalent: number;
	monthlyEquivalent: number;
};
const renewalTermDetail = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	discount: PromoDiscount,
): RenewalTermDetailProps => {
	const billingPeriod = ratePlanToBillingPeriod(
		ratePlanKey,
	) as RecurringBillingPeriod;
	const { durationMonths } = discount;
	const durationPeriods = getNumberOfDiscountedPeriods(
		durationMonths,
		billingPeriod,
	);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const periodName = durationPeriods > 1 ? `${periodNoun}s` : periodNoun;
	const expiry = formatUserDate(
		getPromotionExpiryDate(
			productKey,
			ratePlanKey,
			durationPeriods * getNumberOfMonthsInPeriod(billingPeriod),
		),
	);
	const discountedPrice =
		Math.round(getDiscountedPrice(amount, discount, billingPeriod) * 100) / 100;
	const discountMonthlyEquivalent = monthlyEquivalentPrice(
		discountedPrice,
		billingPeriod,
	);
	const monthlyEquivalent = monthlyEquivalentPrice(amount, billingPeriod);
	return {
		discountedPrice,
		durationPeriods,
		periodName,
		expiry,
		discountMonthlyEquivalent,
		monthlyEquivalent,
	};
};

const promotionDigitalMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion: PromoWithCatalogInformation,
	contribution?: number,
): string => {
	const { discount } = promotion;
	if (!discount) {
		const totalAmount =
			productKey === 'SupporterPlus' ? amount + (contribution ?? 0) : amount;
		return digitalAndPrintMonthly(totalAmount);
	}
	const { discountedPrice, durationPeriods, periodName, expiry } =
		renewalTermDetail(productKey, ratePlanKey, amount, discount);
	const validContribution =
		productKey === 'SupporterPlus' ? contribution ?? 0 : 0;
	const fullPrice = amount + validContribution;
	const discountPrice = discountedPrice + validContribution;
	return `Subscription auto-renews monthly. Pay £${discountPrice}/month for ${durationPeriods} ${periodName}, then £${fullPrice}/month from ${expiry}, unless you cancel. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionPrintMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
	promotion: PromoWithCatalogInformation,
): string => {
	const { discount } = promotion;
	if (!discount) {
		return digitalAndPrintMonthly(fullPrice);
	}
	const { discountedPrice, durationPeriods, periodName, expiry } =
		renewalTermDetail(productKey, ratePlanKey, fullPrice, discount);
	return `Subscription auto-renews monthly. Pay £${discountedPrice}/month for the first ${durationPeriods} ${periodName}, then £${fullPrice}/month from ${expiry}, unless you cancel. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
};

const promotionPrintQuarterly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
	promotion: PromoWithCatalogInformation,
): string => {
	const { discount } = promotion;
	if (!discount) {
		return printQuarterly(fullPrice);
	}
	const {
		discountedPrice,
		periodName,
		durationPeriods,
		expiry,
		discountMonthlyEquivalent,
		monthlyEquivalent,
	} = renewalTermDetail(productKey, ratePlanKey, fullPrice, discount);
	return `Subscription auto-renews quarterly. Pay £${discountedPrice}/quarter for ${durationPeriods} ${periodName}, then £${fullPrice}/quarter from ${expiry}, unless you cancel. Equivalent to £${discountMonthlyEquivalent}/month for ${durationPeriods} ${periodName}, then £${monthlyEquivalent}/month for each quarter after. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
};
const promotionAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion: PromoWithCatalogInformation,
	contribution?: number,
): string => {
	const { discount } = promotion;
	if (!discount) {
		const totalAmount =
			productKey === 'SupporterPlus' ? amount + (contribution ?? 0) : amount;
		return digitalAndPrintAnnual(totalAmount);
	}
	const { discountedPrice, periodName, durationPeriods, expiry } =
		renewalTermDetail(productKey, ratePlanKey, amount, discount);
	const billingPeriod = ratePlanToBillingPeriod(
		ratePlanKey,
	) as RecurringBillingPeriod;
	const validContribution =
		productKey === 'SupporterPlus' ? contribution ?? 0 : 0;
	const fullPrice = amount + validContribution;
	const fullPriceMonthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		billingPeriod,
	);
	const discountPrice = discountedPrice + validContribution;
	const discountPriceMonthlyEquivalent = monthlyEquivalentPrice(
		discountPrice,
		billingPeriod,
	);
	return `Subscription auto-renews annually. Pay £${discountPrice}/year for ${durationPeriods} ${periodName}, then £${fullPrice}/year from ${expiry}, unless you cancel. Equivalent to £${discountPriceMonthlyEquivalent}/month for ${durationPeriods} ${periodName}, then £${fullPriceMonthlyEquivalent}/month for each year after. We'll remind you every year, 2 weeks before your renewal date.`;
};

type Policy = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, string>>>
>;

function getRenewalTerm(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
): string | undefined {
	const renewalTerms: Policy = {
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
	return renewalTerms[productKey]?.[ratePlanKey];
}

function getPromotionalRenewalTerm(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion: PromoWithCatalogInformation,
	contribution?: number,
): string | undefined {
	const promotionAnnualTerms = promotionAnnual(
		productKey,
		ratePlanKey,
		amount,
		promotion,
		contribution,
	);
	const promotionDigitalMonthlyTerms = promotionDigitalMonthly(
		productKey,
		ratePlanKey,
		amount,
		promotion,
		contribution,
	);
	const promotionPrintMonthlyTerms = promotionPrintMonthly(
		productKey,
		ratePlanKey,
		amount,

		promotion,
	);
	const promotionPrintQuarterlyTerms = promotionPrintQuarterly(
		productKey,
		ratePlanKey,
		amount,
		promotion,
	);
	const promotionRenewalTerms: Policy = {
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
	return promotionRenewalTerms[productKey]?.[ratePlanKey];
}

export function getRenewalTermPolicy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion?: PromoWithCatalogInformation,
	contribution?: number,
) {
	const isValidPromotion = promotion?.discount?.amount !== undefined;
	return isValidPromotion
		? getPromotionalRenewalTerm(
				productKey,
				ratePlanKey,
				amount,
				promotion,
				contribution,
		  )
		: getRenewalTerm(
				productKey,
				ratePlanKey,
				productKey === 'SupporterPlus' ? amount + (contribution ?? 0) : amount,
		  );
}
