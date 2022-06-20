import { onConsentChange } from '@guardian/consent-management-platform';
import { loadScript } from '@guardian/libs';
import type { Participations } from 'helpers/abTests/abtest';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { logException } from 'helpers/utilities/logger';
import { getSubscriptionAnnualValue } from './quantumMetricHelpers';

// ---- Types ---- //

type SendEventTestParticipationId = 30;

enum SendEventCheckoutStart {
	DigiSub = 75,
	PaperSub = 76,
	GuardianWeeklySub = 77,
	DigiSubGift = 78,
	GuardianWeeklySubGift = 79,
}

enum SendEventCheckoutConverion {
	DigiSub = 31,
	PaperSub = 67,
	GuardianWeeklySub = 68,
	DigiSubGift = 69,
	GuardianWeeklySubGift = 70,
}

type SendEventId =
	| SendEventTestParticipationId
	| SendEventCheckoutStart
	| SendEventCheckoutConverion;

// ---- sendEvent logic ---- //

function sendEvent(
	id: SendEventId,
	isConversion: boolean,
	value: string,
): void {
	if (window.QuantumMetricAPI?.isOn()) {
		window.QuantumMetricAPI.sendEvent(id, isConversion ? 1 : 0, value);
	}
}

function waitForQuantumMetricAPi(onReady: () => void) {
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

function sendEventSubscriptionCheckoutEvent(
	id: SendEventCheckoutStart | SendEventCheckoutConverion,
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
	isConversion: boolean,
): void {
	void canRunQuantumMetric().then((canRun) => {
		if (canRun) {
			const sendEventWhenReady = () => {
				const sourceCurrency = productPrice.currency;
				const targetCurrency: IsoCurrency = 'GBP';
				const value = getSubscriptionAnnualValue(productPrice, billingPeriod);

				if (!value) {
					return;
				} else if (window.QuantumMetricAPI?.isOn()) {
					const convertedValue: number =
						window.QuantumMetricAPI.currencyConvertFromToValue(
							value,
							sourceCurrency,
							targetCurrency,
						);
					sendEvent(id, isConversion, convertedValue.toString());
				}
			};

			/**
			 * Quantum Metric's script sets up QuantumMetricAPI.
			 * We need to check it is defined and ready before we can
			 * send events to it. If it is ready we call sendEventWhenReady
			 * immediately. If it is not ready we poll a function that checks
			 * if QuantumMetricAPI is available. Once it's available we
			 * call sendEventWhenReady.
			 */
			if (window.QuantumMetricAPI?.isOn()) {
				sendEventWhenReady();
			} else {
				waitForQuantumMetricAPi(() => {
					sendEventWhenReady();
				});
			}
		}
	});
}

function productToCheckoutEvents(
	product: SubscriptionProduct,
	orderIsAGift: boolean,
) {
	switch (product) {
		case 'DigitalPack':
			return orderIsAGift
				? checkoutEvents(
						SendEventCheckoutStart.DigiSubGift,
						SendEventCheckoutConverion.DigiSubGift,
				  )
				: checkoutEvents(
						SendEventCheckoutStart.DigiSub,
						SendEventCheckoutConverion.DigiSub,
				  );
		case 'GuardianWeekly':
			return orderIsAGift
				? checkoutEvents(
						SendEventCheckoutStart.GuardianWeeklySubGift,
						SendEventCheckoutConverion.GuardianWeeklySubGift,
				  )
				: checkoutEvents(
						SendEventCheckoutStart.GuardianWeeklySub,
						SendEventCheckoutConverion.GuardianWeeklySub,
				  );
		case 'Paper':
		case 'PaperAndDigital':
			return checkoutEvents(
				SendEventCheckoutStart.PaperSub,
				SendEventCheckoutConverion.PaperSub,
			);
	}
}

function checkoutEvents(
	start: SendEventCheckoutStart,
	conversion: SendEventCheckoutConverion,
) {
	return { start, conversion };
}

export function sendEventSubscriptionCheckoutStart(
	product: SubscriptionProduct,
	orderIsAGift: boolean,
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
): void {
	const sendEventIds = productToCheckoutEvents(product, orderIsAGift);

	if (sendEventIds) {
		sendEventSubscriptionCheckoutEvent(
			sendEventIds.start,
			productPrice,
			billingPeriod,
			false,
		);
	}
}

export function sendEventSubscriptionCheckoutConversion(
	product: SubscriptionProduct,
	orderIsAGift: boolean,
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
): void {
	const sendEventIds = productToCheckoutEvents(product, orderIsAGift);

	if (sendEventIds) {
		sendEventSubscriptionCheckoutEvent(
			sendEventIds.conversion,
			productPrice,
			billingPeriod,
			true,
		);
	}
}

function sendEventABTestParticipations(participations: Participations): void {
	const sendEventABTestId = 30;
	const valueQueue: string[] = [];

	Object.keys(participations).forEach((testId) => {
		const value = `${testId}-${participations[testId]}`;
		/**
		 * Quantum Metric's script sets up QuantumMetricAPI
		 * We need to check it is defined and ready before we can
		 * send events to it. If it is not ready we add the events to
		 * a valueQueue to be processed later.
		 */
		if (window.QuantumMetricAPI?.isOn()) {
			sendEvent(sendEventABTestId, false, value);
		} else {
			valueQueue.push(value);
		}
	});

	/**
	 * If valueQueue is populated QuantumMetricAPI was not ready to be
	 * sent events, in this scenario we poll a function that checks if
	 * QuantumMetricAPI is available. Once it's available we process the
	 * queue of values to be sent with sendEvent.
	 */
	if (valueQueue.length) {
		waitForQuantumMetricAPi(() => {
			valueQueue.forEach((value) => {
				sendEvent(sendEventABTestId, false, value);
			});
		});
	}
}

// ---- Initialisation ---- //

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

function canRunQuantumMetric(): Promise<boolean> {
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

export function init(participations: Participations): void {
	void canRunQuantumMetric().then((canRun) => {
		if (canRun) {
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
