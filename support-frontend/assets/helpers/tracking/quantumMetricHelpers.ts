import { getConsentFor, onConsent } from '@guardian/libs';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';

const periodMultipliers: Record<BillingPeriod, number> = {
	OneTime: 1,
	Annual: 1,
	Quarterly: 4,
	Monthly: 12,
};

export function getSubscriptionAnnualValue(
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
): number | undefined {
	const fullPrice = productPrice.price;
	const promotion = getAppliedPromo(productPrice.promotions);

	/**
	 * This catches the event that the SixWeekly BillingPeriod is used
	 * and returns immediately. We shouldn't have to handle at runtime as the SixWeekly billing
	 * period is deprecated. We should look into whether we want to retain/remove logic
	 * to handle it in our code.
	 */
	const periodMultiplier = periodMultipliers[billingPeriod];
	if (periodMultiplier === 0) {
		return;
	}

	const fullPriceInPence = fullPrice * 100;
	const fullAnnualPrice =
		fullPriceInPence * (productPrice.fixedTerm ? 1 : periodMultiplier);

	if (!promotion?.discountedPrice || !promotion.numberOfDiscountedPeriods) {
		return fullAnnualPrice;
	}

	const discountedPriceInPence = promotion.discountedPrice * 100;
	const discountInPenceCents = fullPriceInPence - discountedPriceInPence;

	const discountedAnnualPrice =
		fullAnnualPrice -
		discountInPenceCents * promotion.numberOfDiscountedPeriods;

	return discountedAnnualPrice;
}

export function getConvertedAnnualValue(
	billingPeriod: BillingPeriod,
	amount: number,
	sourceCurrency: IsoCurrency,
): number | undefined {
	const annualAmount = amount * periodMultipliers[billingPeriod];
	return getConvertedValue(annualAmount, sourceCurrency);
}

export function getConvertedValue(
	annualAmount: number,
	sourceCurrency: IsoCurrency,
): number | undefined {
	const valueInPence = annualAmount * 100;
	const targetCurrency: IsoCurrency = 'GBP';
	if (window.QuantumMetricAPI?.isOn()) {
		const convertedValue: number =
			window.QuantumMetricAPI.currencyConvertFromToValue(
				valueInPence,
				sourceCurrency,
				targetCurrency,
			);
		return convertedValue;
	}
	return;
}

// TODO: To be deleted with the 2-step checkout
export function getContributionAnnualValue(
	billingPeriod: BillingPeriod,
	amount: number,
	sourceCurrency: IsoCurrency,
): number | undefined {
	const valueInPence = amount * 100 * periodMultipliers[billingPeriod];
	const targetCurrency: IsoCurrency = 'GBP';

	if (window.QuantumMetricAPI?.isOn()) {
		const convertedValue: number =
			window.QuantumMetricAPI.currencyConvertFromToValue(
				valueInPence,
				sourceCurrency,
				targetCurrency,
			);
		return convertedValue;
	}

	return;
}

export function waitForQuantumMetricAPi(onReady: () => void): void {
	let pollCount = 0;
	const checkForQuantumMetricAPi = setInterval(() => {
		pollCount = pollCount + 1;
		if (window.QuantumMetricAPI?.isOn()) {
			onReady();
			clearInterval(checkForQuantumMetricAPi);
		} else if (pollCount === 10) {
			// give up waiting if QuantumMetricAPI is not ready after 10 attempts
			clearInterval(checkForQuantumMetricAPi);
		}
	}, 500);
}

export function canRunQuantumMetric(): Promise<boolean> {
	// resolve immediately with false if the feature switch is OFF
	if (!isSwitchOn('featureSwitches.enableQuantumMetric')) {
		return Promise.resolve(false);
	}
	// check users consent state
	return onConsent().then((state) => {
		return getConsentFor('qm', state);
	});
}
