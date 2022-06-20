import { onConsentChange } from '@guardian/consent-management-platform';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
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
		SixWeekly: 0,
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
	// checks users consent status
	return new Promise((resolve) => {
		onConsentChange((state) => {
			if (
				state.ccpa?.doNotSell === false || // check whether US users have NOT withdrawn consent
				state.aus?.personalisedAdvertising || // check whether AUS users have consented to personalisedAdvertising
				(state.tcfv2?.consents && // check TCFv2 purposes for non-US/AUS users
					state.tcfv2.consents['1'] && // Store and/or access information on a device
					state.tcfv2.consents['8'] && // Measure content performance
					state.tcfv2.consents['10']) // Develop and improve products
			) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}
