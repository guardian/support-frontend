import { onConsentChange } from '@guardian/consent-management-platform';
import { loadScript } from '@guardian/libs';
import type { Participations } from 'helpers/abTests/abtest';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type {
	DigitalBillingPeriod,
	DigitalGiftBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { logException } from 'helpers/utilities/logger';
import { getAnnualValue } from './quantumMetricHelpers';

type SendEventABTestId = 30;
type SendEventDigiSubCheckoutStart = 75;
type SendEventPaperSubCheckoutStart = 76;
type SendEventGuardianWeeklySubCheckoutStart = 77;
type SendEventDigiSubGiftCheckoutStart = 78;
type SendEventGuardianWeeklySubGiftCheckoutStart = 79;
type SendEventDigiSubConversion = 31;
type SendEventPaperSubConversion = 67;
type SendEventGuardianWeeklySubConversion = 68;
type SendEventDigiSubGiftConversion = 69;
type SendEventGuardianWeeklySubGiftConversion = 70;

type SendEventId =
	| SendEventABTestId
	| SendEventDigiSubCheckoutStart
	| SendEventPaperSubCheckoutStart
	| SendEventGuardianWeeklySubCheckoutStart
	| SendEventDigiSubGiftCheckoutStart
	| SendEventGuardianWeeklySubGiftCheckoutStart
	| SendEventDigiSubConversion
	| SendEventPaperSubConversion
	| SendEventGuardianWeeklySubConversion
	| SendEventDigiSubGiftConversion
	| SendEventGuardianWeeklySubGiftConversion;

const sendEventIds: Record<string, SendEventId> = {
	abTestParticipation: 30,
	digiSubCheckoutStart: 75,
	digiSubGiftCheckoutStart: 78,
};

function sendEvent(
	id: SendEventId,
	isConversion: boolean,
	value: string,
): void {
	console.log('sendEvent --->', id, isConversion, value);
	if (window.QuantumMetricAPI?.isOn()) {
		window.QuantumMetricAPI.sendEvent(id, isConversion ? 1 : 0, value);
	}
}

function sendEventWithProductAnnualValue(
	id: SendEventId,
	isConversion: boolean,
	productPrice: ProductPrice,
	billingPeriod: DigitalBillingPeriod | DigitalGiftBillingPeriod,
): void {
	void getConsent().then((hasConsent) => {
		if (hasConsent) {
			const sourceCurrency = productPrice.currency;
			const value = getAnnualValue(productPrice, billingPeriod);
			const targetCurrency: IsoCurrency = 'GBP';
			const sendEventWhenReady = () => {
				if (window.QuantumMetricAPI?.isOn()) {
					const convertedValue: number =
						window.QuantumMetricAPI.currencyConvertFromToValue(
							value,
							sourceCurrency,
							targetCurrency,
						);
					sendEvent(id, isConversion, convertedValue.toString());
				}
			};

			if (window.QuantumMetricAPI?.isOn()) {
				sendEventWhenReady();
			} else {
				const waitForQuantumMetricAPi = setInterval(() => {
					if (window.QuantumMetricAPI?.isOn()) {
						sendEventWhenReady();
						clearInterval(waitForQuantumMetricAPi);
					}
				}, 100);
			}
		}
	});
}

function sendEventABTestParticipations(participations: Participations): void {
	const { abTestParticipation } = sendEventIds;
	const sendEventQueue: Array<() => void> = [];

	Object.keys(participations).forEach((testId) => {
		const value = `${testId}-${participations[testId]}`;
		/**
		 * Quantum Metric's script sets up QuantumMetricAPI
		 * We need to check it is defined and ready before we can
		 * send events to it. If it is not ready we add the events to
		 * a valueQueue to be processed later.
		 */
		if (window.QuantumMetricAPI?.isOn()) {
			sendEvent(abTestParticipation, false, value);
		} else {
			sendEventQueue.push(() => {
				sendEvent(abTestParticipation, false, value);
			});
		}
	});

	/**
	 * If valueQueue is populated QuantumMetricAPI was not ready to be
	 * sent events, in this scenario we poll a function that checks if
	 * QuantumMetricAPI is available. Once it's available we process the
	 * queue of values to be sent with sendEvent.
	 */
	if (sendEventQueue.length) {
		const waitForQuantumMetricAPi = setInterval(() => {
			if (window.QuantumMetricAPI?.isOn()) {
				sendEventQueue.forEach((queuedSendEvent) => {
					queuedSendEvent();
				});
				clearInterval(waitForQuantumMetricAPi);
			}
		}, 100);
	}
}

function addQM() {
	return loadScript(
		'https://cdn.quantummetric.com/instrumentation/1.31.3/quantum-gnm.js',
		{
			async: true,
			integrity:
				'sha384-jL1rlM/U30WWRsDEQDalNiDV8FOjayD5RCgzkywrohMqg6oME3zbszWB31/40MAD',
			crossOrigin: 'anonymous',
		},
	).catch(() => {
		logException('Failed to load Quantum Metric');
	});
}

function getConsent(): Promise<boolean> {
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

function init(participations: Participations): void {
	// return immediately if the feature switch is OFF
	if (!isSwitchOn('featureSwitches.enableQuantumMetric')) {
		return;
	}
	void getConsent().then((hasConsent) => {
		if (hasConsent) {
			void addQM().then(() => {
				/**
				 * Quantum Metric's script has loaded so we can attempt to
				 * send user AB test participations via the sendEvent function.
				 */
				sendEventABTestParticipations(participations);
			});
		}
	});
}

export { init, sendEventWithProductAnnualValue, sendEventIds };
