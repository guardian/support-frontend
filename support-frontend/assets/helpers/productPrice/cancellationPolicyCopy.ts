import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from './promotions';
import type { Policy } from './renewalTermsPolicyCopy';

const digitalMonthlyCopy =
	'Cancel anytime, via your account. Cancel within 14 days of sign-up and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const digitalAnnualCopy =
	'Cancel anytime, via your account. Cancel within 14 days of sign-up or each renewal and receive a full refund of your last payment. See more about your cooling-off rights in your full pre-contract information here.';
const studentAnnualCopy = `You may cancel your All-access digital subscription within 14 days of taking out the subscription. If you do, you'll receive a full refund and your subscription will stop immediately. To cancel, go to Manage My Account or see our Terms. This subscription does not auto-renew.`;

const printMonthlyDeliveryCopy =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your first issue and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const printMonthlySubscriptionCopy =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your subscription card and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const printAnnualDeliveryCopy =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your first issue and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const printGiftCopy = `By proceeding, you are agreeing to our Terms & Conditions. This subscription does not auto-renew. If you cancel within 14 days of sign-up, you’ll receive a full refund. To cancel within 14 days of sign-up and receive a refund contact Customer Service.`;
const observerDeliveryCopy = printMonthlyDeliveryCopy;
const observerSubscriptionCopy = printMonthlySubscriptionCopy;

const cancellationCopy: Policy = {
	GuardianAdLite: {
		Monthly: digitalMonthlyCopy,
	},
	SupporterPlus: {
		Monthly: digitalMonthlyCopy,
		MonthlyTaxExclusive: digitalMonthlyCopy,
		Annual: digitalAnnualCopy,
		AnnualTaxExclusive: digitalAnnualCopy,
		OneYearStudent: studentAnnualCopy,
	},
	DigitalSubscription: {
		Monthly: digitalMonthlyCopy,
		MonthlyTaxExclusive: digitalMonthlyCopy,
		Annual: digitalAnnualCopy,
		AnnualTaxExclusive: digitalAnnualCopy,
	},
	GuardianWeeklyDomestic: {
		MonthlyPlus: printMonthlyDeliveryCopy,
		QuarterlyPlus: printMonthlyDeliveryCopy,
		AnnualPlus: printAnnualDeliveryCopy,
		ThreeMonthGift: printGiftCopy,
		OneYearGift: printGiftCopy,
	},
	GuardianWeeklyRestOfWorld: {
		MonthlyPlus: printMonthlyDeliveryCopy,
		QuarterlyPlus: printMonthlyDeliveryCopy,
		AnnualPlus: printAnnualDeliveryCopy,
		ThreeMonthGift: printGiftCopy,
		OneYearGift: printGiftCopy,
	},
	SubscriptionCard: {
		EverydayPlus: printMonthlySubscriptionCopy,
		SixdayPlus: printMonthlySubscriptionCopy,
		WeekendPlus: printMonthlySubscriptionCopy,
		SaturdayPlus: printMonthlySubscriptionCopy,
		Sunday: observerSubscriptionCopy,
	},
	HomeDelivery: {
		EverydayPlus: printMonthlyDeliveryCopy,
		SixdayPlus: printMonthlyDeliveryCopy,
		WeekendPlus: printMonthlyDeliveryCopy,
		SaturdayPlus: printMonthlyDeliveryCopy,
		Sunday: observerDeliveryCopy,
	},
};

function promotionalCancellationCopy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promotion?: Promotion,
): string {
	const digitalMonthlyPromotionCopy = (firstPayment: number): string => {
		return `Cancel anytime, via your account. Cancel within 14 days of sign-up or your first payment at £${firstPayment} and receive a full refund of your last payment. See more about your cooling-off rights in your full pre-contract information here.`;
	};
	const printMonthlyPromotionCopy = (
		productKey: ActiveProductKey,
		firstPayment: number,
	): string => {
		return `Cancel anytime, via your account. Cancel within 14 days of receiving your ${
			productKey === 'SubscriptionCard' ? 'subscription card' : 'first issue'
		} or your first payment at £${firstPayment} and receive a full refund of that payment. See more about your cooling-off rights in your full pre-contract information here.`;
	};
	const observeMonthlyPromotionCopy = (
		productKey: ActiveProductKey,
	): string => {
		return `Cancel anytime, via your account. Cancel within 14 days of receiving your ${
			productKey === 'SubscriptionCard' ? 'subscription card' : 'first issue'
		} and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.`;
	};

	const firstPayment = promotion?.discountedPrice ?? 0;
	const cancellationPromotionCopy = {
		...cancellationCopy,
		SupporterPlus: {
			...cancellationCopy.SupporterPlus,
			Monthly: digitalMonthlyPromotionCopy(firstPayment),
			MonthlyTaxExclusive: digitalMonthlyPromotionCopy(firstPayment),
		},
		DigitalSubscription: {
			...cancellationCopy.DigitalSubscription,
			Monthly: digitalMonthlyPromotionCopy(firstPayment),
			MonthlyTaxExclusive: digitalMonthlyPromotionCopy(firstPayment),
		},
		GuardianWeeklyDomestic: {
			...cancellationCopy.GuardianWeeklyDomestic,
			Monthly: printMonthlyPromotionCopy('SubscriptionCard', firstPayment),
		},
		GuardianWeeklyRestOfWorld: {
			...cancellationCopy.GuardianWeeklyRestOfWorld,
			Monthly: printMonthlyPromotionCopy('SubscriptionCard', firstPayment),
		},
		SubscriptionCard: {
			...cancellationCopy.SubscriptionCard,
			EverydayPlus: printMonthlyPromotionCopy('SubscriptionCard', firstPayment),
			SixdayPlus: printMonthlyPromotionCopy('SubscriptionCard', firstPayment),
			WeekendPlus: printMonthlyPromotionCopy('SubscriptionCard', firstPayment),
			SaturdayPlus: printMonthlyPromotionCopy('SubscriptionCard', firstPayment),
			Sunday: observeMonthlyPromotionCopy('SubscriptionCard'),
		},
		HomeDelivery: {
			...cancellationCopy.HomeDelivery,
			EverydayPlus: printMonthlyPromotionCopy('HomeDelivery', firstPayment),
			SixdayPlus: printMonthlyPromotionCopy('HomeDelivery', firstPayment),
			WeekendPlus: printMonthlyPromotionCopy('HomeDelivery', firstPayment),
			SaturdayPlus: printMonthlyPromotionCopy('HomeDelivery', firstPayment),
			Sunday: observeMonthlyPromotionCopy('HomeDelivery'),
		},
	};
	return cancellationPromotionCopy[productKey]?.[ratePlanKey] ?? '';
}

export function getCancellationCopy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promotion?: Promotion,
) {
	// const currencyGlyph = glyph(currency);
	// const billingPeriod = getBillingPeriodNoun(
	// 	ratePlanToBillingPeriod(ratePlanKey),
	// );
	return promotion
		? promotionalCancellationCopy(productKey, ratePlanKey, promotion)
		: cancellationCopy[productKey]?.[ratePlanKey] ?? '';
}
