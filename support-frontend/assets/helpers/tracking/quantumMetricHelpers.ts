import { getConsentFor, onConsent } from '@guardian/libs';
import type { ContributionType } from 'helpers/contributions';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';

export function getSubscriptionAnnualValue(
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
): number | undefined {
	const fullPrice = productPrice.price;
	const promotion = getAppliedPromo(productPrice.promotions);

	const periodMultipliers: Record<BillingPeriod, number> = {
		Annual: 1,
		Monthly: 12,
		Quarterly: 4,
	};

	const periodMultiplier = periodMultipliers[billingPeriod];

	/**
	 * This catches the event that the SixWeekly BillingPeriod is used
	 * and returns immediately. We shouldn't have to handle at runtime as the SixWeekly billing
	 * period is deprecated. We should look into whether we want to retain/remove logic
	 * to handle it in our code.
	 */
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

export function getContributionAnnualValue(
	contributionType: ContributionType,
	amount: number,
	sourceCurrency: IsoCurrency,
): number | undefined {
	const valueInPence =
		contributionType === 'ONE_OFF' || contributionType === 'ANNUAL'
			? amount * 100
			: amount * 100 * 12;
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
