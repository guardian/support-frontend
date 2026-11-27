import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { manageAccountLink } from 'helpers/legal';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import { textLink } from 'helpers/utilities/textLink';
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
export const getFirstDeliveryDateInclDigitalSubscription = (
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

const contributionMonthly = (fullPrice: number): JSX.Element => (
	<>
		We will attempt to take payment of £{fullPrice}, on the{' '}
		{getDateWithOrdinal(new Date())} day of every month, from now until you
		cancel your payment. Payments may take up to 6 days to be recorded in your
		bank account. You can change how much you give or cancel your payment at any
		time.
	</>
);

const digitalMonthly = (fullPrice: number): JSX.Element => (
	<>
		Subscription <strong>auto-renews monthly</strong>. Pay{' '}
		<strong>£{fullPrice}/month</strong>, unless you cancel. We'll remind you
		every 6 months, 1 week before your subscription auto-renews. To stop
		auto-renewal, cancel via {textLink('Manage My Account', manageAccountLink)}{' '}
		before your next renewal date.
	</>
);
const printMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
): JSX.Element => {
	const deliveryDate =
		getFirstDeliveryDateInclDigitalSubscription(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		) ?? new Date();
	return (
		<>
			Subscription <strong>auto-renews monthly</strong>. Your first payment will
			be taken on {formatUserDate(deliveryDate)}. You'll pay{' '}
			<strong>£{fullPrice}/month</strong>, unless you cancel. We'll remind you
			every 6 months, 1 week before your subscription auto-renews. To stop
			auto-renewal, cancel via{' '}
			{textLink('Manage My Account', manageAccountLink)} before your next
			renewal date.
		</>
	);
};

const digitalAnnual = (fullPrice: number): JSX.Element => {
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Annual,
	);
	return (
		<>
			Subscription <strong>auto-renews annually</strong>. Pay{' '}
			<strong>£{fullPrice}</strong>/year, unless you cancel (if payments were
			due monthly this would be £{monthlyEquivalent}
			/month). We'll send you a reminder 14 and 7 days before each renewal. To
			stop auto-renewal, cancel via{' '}
			{textLink('Manage My Account', manageAccountLink)} before your next
			renewal date.
		</>
	);
};

const printAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
): JSX.Element => {
	const deliveryDate =
		getFirstDeliveryDateInclDigitalSubscription(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		) ?? new Date();
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Annual,
	);
	return (
		<>
			Subscription <strong>auto-renews annually</strong>. Your first payment
			will be taken on {formatUserDate(deliveryDate)}. You'll pay{' '}
			<strong>£{fullPrice}/year</strong>, unless you cancel (if payments were
			due monthly this would be £{monthlyEquivalent}
			/month). We'll send you a reminder 14 and 7 days before each renewal. To
			stop auto-renewal, cancel via{' '}
			{textLink('Manage My Account', manageAccountLink)} before your next
			renewal date.
		</>
	);
};

const printQuarterly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
): JSX.Element => {
	const deliveryDate =
		getFirstDeliveryDateInclDigitalSubscription(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		) ?? new Date();
	const monthlyEquivalent = monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Quarterly,
	);
	return (
		<>
			Subscription <strong>auto-renews quarterly</strong>. Your first payment
			will be taken on {formatUserDate(deliveryDate)}. You'll pay{' '}
			<strong>£{fullPrice}/quarter</strong>, unless you cancel (if payments were
			due monthly this would be £{monthlyEquivalent}/month). We'll remind you
			every 6 months, 1 week before your subscription auto-renews. To stop
			auto-renewal, cancel via{' '}
			{textLink('Manage My Account', manageAccountLink)} before your next
			renewal date.
		</>
	);
};

type RenewalTermDetailProps = {
	discountedPrice: number;
	durationPeriods: number;
	periodName: string;
	expiry: string;
	delivery: string;
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
	const delivery = formatUserDate(
		getFirstDeliveryDateInclDigitalSubscription(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		) ?? new Date(),
	);
	return {
		discountedPrice,
		durationPeriods,
		periodName,
		expiry,
		delivery,
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
): JSX.Element => {
	const { discount } = promotion;
	if (!discount) {
		const totalAmount =
			productKey === 'SupporterPlus' ? amount + (contribution ?? 0) : amount;
		return digitalMonthly(totalAmount);
	}
	const { discountedPrice, durationPeriods, periodName, expiry } =
		renewalTermDetail(productKey, ratePlanKey, amount, discount);
	const validContribution =
		productKey === 'SupporterPlus' ? contribution ?? 0 : 0;
	const fullPrice = amount + validContribution;
	const discountPrice = discountedPrice + validContribution;
	return (
		<>
			Subscription <strong>auto-renews monthly</strong>. Pay{' '}
			<strong>£{discountPrice}/month</strong> for{' '}
			<strong>
				{durationPeriods} {periodName}
			</strong>
			, then <strong>£{fullPrice}/month</strong> from <strong>{expiry}</strong>,
			unless you cancel. We'll remind you 1 week before your first higher
			payment, then every 6 months, 1 week before your subscription auto-renews.
			To stop auto-renewal, cancel via{' '}
			{textLink('Manage My Account', manageAccountLink)} before your next
			renewal date.
		</>
	);
};
const promotionPrintMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
	promotion: PromoWithCatalogInformation,
): JSX.Element => {
	const { discount } = promotion;
	if (!discount) {
		return printMonthly(productKey, ratePlanKey, fullPrice);
	}
	const { discountedPrice, durationPeriods, periodName, expiry, delivery } =
		renewalTermDetail(productKey, ratePlanKey, fullPrice, discount);
	return (
		<>
			Subscription <strong>auto-renews monthly</strong>. Your first payment will
			be taken on <strong>{delivery}</strong>. You'll pay{' '}
			<strong>£{discountedPrice}/month</strong> for{' '}
			<strong>
				{durationPeriods} {periodName}
			</strong>
			, then <strong>£{fullPrice}/month</strong> from <strong>{expiry}</strong>,
			unless you cancel. We'll remind you 1 week before your first higher
			payment, then every 6 months, 1 week before your subscription auto-renews.
			To stop auto-renewal, cancel via{' '}
			{textLink('Manage My Account', manageAccountLink)} before your next
			renewal date.
		</>
	);
};

const promotionPrintQuarterly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
	promotion: PromoWithCatalogInformation,
): JSX.Element => {
	const { discount } = promotion;
	if (!discount) {
		return printQuarterly(productKey, ratePlanKey, fullPrice);
	}
	const {
		discountedPrice,
		periodName,
		durationPeriods,
		expiry,
		discountMonthlyEquivalent,
		monthlyEquivalent,
	} = renewalTermDetail(productKey, ratePlanKey, fullPrice, discount);
	return (
		<>
			Subscription auto-renews quarterly. Pay £{discountedPrice}/quarter for{' '}
			{durationPeriods} {periodName}, then £{fullPrice}/quarter from {expiry},
			unless you cancel. Equivalent to £{discountMonthlyEquivalent}/month for{' '}
			{durationPeriods} {periodName}, then £{monthlyEquivalent}/month for each
			quarter after. We'll remind you 2 weeks before {expiry} then every 6
			months, 2 weeks before your renewal date.
		</>
	);
};
const promotionAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion: PromoWithCatalogInformation,
	contribution?: number,
): JSX.Element => {
	const { discount } = promotion;
	if (!discount) {
		const totalAmount =
			productKey === 'SupporterPlus' ? amount + (contribution ?? 0) : amount;
		return digitalAnnual(totalAmount);
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
	return (
		<>
			Subscription auto-renews annually. Pay £{discountPrice}/year for{' '}
			{durationPeriods} {periodName}, then £{fullPrice}/year from {expiry},
			unless you cancel. Equivalent to £{discountPriceMonthlyEquivalent}/month
			for {durationPeriods} {periodName}, then £{fullPriceMonthlyEquivalent}
			/month for each year after. We'll remind you every year, 2 weeks before
			your renewal date.
		</>
	);
};

type Policy = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, JSX.Element>>>
>;

function getRenewalTerm(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	fullPrice: number,
): JSX.Element | undefined {
	const renewalTerms: Policy = {
		Contribution: {
			Monthly: contributionMonthly(fullPrice),
			Annual: digitalAnnual(fullPrice),
		},
		GuardianAdLite: {
			Monthly: digitalMonthly(fullPrice),
		},
		SupporterPlus: {
			Monthly: digitalMonthly(fullPrice),
			MonthlyTaxExclusive: digitalMonthly(fullPrice),
			Annual: digitalAnnual(fullPrice),
			AnnualTaxExclusive: digitalAnnual(fullPrice),
		},
		DigitalSubscription: {
			Monthly: digitalMonthly(fullPrice),
			MonthlyTaxExclusive: digitalMonthly(fullPrice),
			Annual: digitalAnnual(fullPrice),
			AnnualTaxExclusive: digitalAnnual(fullPrice),
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			QuarterlyPlus: printQuarterly(productKey, ratePlanKey, fullPrice),
			AnnualPlus: printAnnual(productKey, ratePlanKey, fullPrice),
		},
		GuardianWeeklyRestOfWorld: {
			MonthlyPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			QuarterlyPlus: printQuarterly(productKey, ratePlanKey, fullPrice),
			AnnualPlus: printAnnual(productKey, ratePlanKey, fullPrice),
		},
		SubscriptionCard: {
			EverydayPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			SixdayPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			WeekendPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			SaturdayPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			Sunday: printMonthly(productKey, ratePlanKey, fullPrice),
		},
		HomeDelivery: {
			EverydayPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			SixdayPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			WeekendPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			SaturdayPlus: printMonthly(productKey, ratePlanKey, fullPrice),
			Sunday: printMonthly(productKey, ratePlanKey, fullPrice),
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
): JSX.Element | undefined {
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
