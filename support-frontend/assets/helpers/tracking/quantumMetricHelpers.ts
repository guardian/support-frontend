import { getConsentFor, onConsent } from '@guardian/consent-manager';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

const periodMultipliers: Record<BillingPeriod, number> = {
	OneTime: 1,
	Annual: 1,
	Quarterly: 4,
	Monthly: 12,
};

export function getConvertedAnnualValue(
	billingPeriod: BillingPeriod,
	amount: number,
	sourceCurrency: CurrencyCode,
): number | undefined {
	const annualAmount = amount * periodMultipliers[billingPeriod];
	return getConvertedValue(annualAmount, sourceCurrency);
}

export function getConvertedValue(
	annualAmount: number,
	sourceCurrency: CurrencyCode,
): number | undefined {
	const valueInPence = annualAmount * 100;
	const targetCurrency: CurrencyCode = 'GBP';
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
	sourceCurrency: CurrencyCode,
): number | undefined {
	const valueInPence = amount * 100 * periodMultipliers[billingPeriod];
	const targetCurrency: CurrencyCode = 'GBP';

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
