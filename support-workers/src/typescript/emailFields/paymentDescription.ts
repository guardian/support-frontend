import { partition } from '@modules/arrayFunctions';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { isNonEmpty } from '@modules/nullAndUndefined';
import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import type { Payment, PaymentSchedule } from '../model/paymentSchedule';

function billingPeriodNoun(period: BillingPeriod): string {
	switch (period) {
		case BillingPeriod.Monthly:
			return 'month';
		case BillingPeriod.Quarterly:
			return 'quarter';
		case BillingPeriod.Annual:
			return 'year';
		default:
			return period;
	}
}

export function formatPrice(amount: number): string {
	return amount.toFixed(2);
}

export function priceWithCurrency(
	currency: IsoCurrency,
	amount: number,
): string {
	return `${getCurrencyInfo(currency).glyph}${formatPrice(amount)}`;
}

export function firstPayment(paymentSchedule: PaymentSchedule): Payment {
	if (
		paymentSchedule.payments.length === 0 ||
		paymentSchedule.payments[0] === undefined
	) {
		throw new Error('Payment schedule has no payments');
	}
	return paymentSchedule.payments.reduce<Payment>(
		(min, payment) => (payment.date < min.date ? payment : min),
		paymentSchedule.payments[0],
	);
}

// Helper that asserts a non-empty array of payments and returns the earliest one
function earliestPayment(payments: [Payment, ...Payment[]]): Payment {
	return payments.reduce<Payment>(
		(min, payment) => (payment.date < min.date ? payment : min),
		payments[0],
	);
}

export function pluralise(num: number, thing: string): string {
	return num > 1 ? `${num} ${thing}s` : `${num} ${thing}`;
}

export function introductoryPeriod(
	introductoryBillingPeriods: number,
	billingPeriod: BillingPeriod,
): string {
	return pluralise(
		introductoryBillingPeriods,
		billingPeriodNoun(billingPeriod),
	);
}

export function fixedTermNoun(billingPeriod: BillingPeriod): string {
	switch (billingPeriod) {
		case BillingPeriod.Quarterly:
			return '3 months';
		case BillingPeriod.Annual:
			return '12 months';
		default:
			return billingPeriodNoun(billingPeriod);
	}
}

function monthsBetween(start: Date, end: Date): number {
	const startD = dayjs(start);
	const endD = dayjs(end);
	return endD.diff(startD, 'month');
}

export function describePayments(
	paymentSchedule: PaymentSchedule,
	billingPeriod: BillingPeriod,
	currency: IsoCurrency,
	fixedTerm: boolean,
): string {
	const initialPrice = firstPayment(paymentSchedule).amount;

	const [paymentsWithInitialPrice, paymentsWithDifferentPrice] = partition(
		paymentSchedule.payments,
		(payment) => payment.amount === initialPrice,
	);

	const noun = billingPeriodNoun(billingPeriod);

	if (fixedTerm) {
		return `${priceWithCurrency(currency, initialPrice)} for ${fixedTermNoun(
			billingPeriod,
		)}`;
	}
	if (paymentSchedule.payments.length === 1) {
		return `${priceWithCurrency(currency, initialPrice)} for the first ${noun}`;
	}
	if (paymentsWithDifferentPrice.length === 0) {
		return `${priceWithCurrency(currency, initialPrice)} every ${noun}`;
	}
	if (
		paymentsWithInitialPrice.length === 1 &&
		isNonEmpty(paymentsWithDifferentPrice)
	) {
		return descriptionWithSingleIntroductoryPeriod(
			paymentsWithDifferentPrice,
			currency,
			initialPrice,
			billingPeriod,
		);
	}
	return descriptionWithMultipleIntroductoryPeriods(
		paymentsWithInitialPrice as [Payment, ...Payment[]],
		paymentsWithDifferentPrice,
		currency,
		initialPrice,
		billingPeriod,
	);
}

function descriptionWithSingleIntroductoryPeriod(
	paymentsWithDifferentPrice: [Payment, ...Payment[]],
	currency: IsoCurrency,
	initialPrice: number,
	billingPeriod: BillingPeriod,
) {
	const firstDifferent = paymentsWithDifferentPrice[0];
	return `${priceWithCurrency(
		currency,
		initialPrice,
	)} for the first ${billingPeriodNoun(
		billingPeriod,
	)}, then ${priceWithCurrency(
		currency,
		firstDifferent.amount,
	)} every ${billingPeriodNoun(billingPeriod)}`;
}

function descriptionWithMultipleIntroductoryPeriods(
	paymentsWithInitialPrice: [Payment, ...Payment[]],
	paymentsWithDifferentPrice: Payment[],
	currency: IsoCurrency,
	initialPrice: number,
	billingPeriod: BillingPeriod,
) {
	const firstIntroductoryPayment = earliestPayment(paymentsWithInitialPrice);
	const firstDifferentPayment = earliestPayment(
		paymentsWithDifferentPrice as [Payment, ...Payment[]],
	);
	const monthsAtIntroductoryPrice = monthsBetween(
		firstIntroductoryPayment.date,
		firstDifferentPayment.date,
	);
	let timespan: string;
	switch (billingPeriod) {
		case BillingPeriod.Annual:
			timespan = introductoryPeriod(
				monthsAtIntroductoryPrice / 12,
				billingPeriod,
			);
			break;
		case BillingPeriod.Quarterly:
			timespan = introductoryPeriod(
				monthsAtIntroductoryPrice / 3,
				billingPeriod,
			);
			break;
		case BillingPeriod.Monthly:
			timespan = introductoryPeriod(monthsAtIntroductoryPrice, billingPeriod);
			break;
		default:
			timespan = introductoryPeriod(monthsAtIntroductoryPrice, billingPeriod);
	}
	return `${priceWithCurrency(
		currency,
		initialPrice,
	)} every ${billingPeriodNoun(
		billingPeriod,
	)} for ${timespan}, then ${priceWithCurrency(
		currency,
		earliestPayment(paymentsWithDifferentPrice as [Payment, ...Payment[]])
			.amount,
	)} every ${billingPeriodNoun(billingPeriod)}`;
}
