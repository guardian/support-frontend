import { loadScript } from '@guardian/libs';
import type { Participations } from 'helpers/abTests/abtest';
import type { ContributionType } from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { logException } from 'helpers/utilities/logger';
import {
	canRunQuantumMetric,
	getContributionAnnualValue,
	getSubscriptionAnnualValue,
	waitForQuantumMetricAPi,
} from './quantumMetricHelpers';

// ---- Types ---- //

type SendEventTestParticipationId = 30;

enum SendEventSubscriptionCheckoutStart {
	DigiSub = 75,
	PaperSub = 76,
	GuardianWeeklySub = 77,
	DigiSubGift = 78,
	GuardianWeeklySubGift = 79,
}

enum SendEventSubscriptionCheckoutConversion {
	DigiSub = 31,
	PaperSub = 67,
	GuardianWeeklySub = 68,
	DigiSubGift = 69,
	GuardianWeeklySubGift = 70,
}

enum SendEventContributionAmountUpdate {
	SingleContribution = 71,
	RecurringContribution = 72,
}

enum SendEventContributionCheckoutConversion {
	SingleContribution = 73,
	RecurringContribution = 74,
}

type SendEventId =
	| SendEventTestParticipationId
	| SendEventSubscriptionCheckoutStart
	| SendEventSubscriptionCheckoutConversion
	| SendEventContributionAmountUpdate
	| SendEventContributionCheckoutConversion;

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

function sendEventWhenReadyTrigger(sendEventWhenReady: () => void): void {
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

function sendEventSubscriptionCheckoutEvent(
	id:
		| SendEventSubscriptionCheckoutStart
		| SendEventSubscriptionCheckoutConversion,
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

			sendEventWhenReadyTrigger(sendEventWhenReady);
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
						SendEventSubscriptionCheckoutStart.DigiSubGift,
						SendEventSubscriptionCheckoutConversion.DigiSubGift,
				  )
				: checkoutEvents(
						SendEventSubscriptionCheckoutStart.DigiSub,
						SendEventSubscriptionCheckoutConversion.DigiSub,
				  );
		case 'GuardianWeekly':
			return orderIsAGift
				? checkoutEvents(
						SendEventSubscriptionCheckoutStart.GuardianWeeklySubGift,
						SendEventSubscriptionCheckoutConversion.GuardianWeeklySubGift,
				  )
				: checkoutEvents(
						SendEventSubscriptionCheckoutStart.GuardianWeeklySub,
						SendEventSubscriptionCheckoutConversion.GuardianWeeklySub,
				  );
		case 'Paper':
		case 'PaperAndDigital':
			return checkoutEvents(
				SendEventSubscriptionCheckoutStart.PaperSub,
				SendEventSubscriptionCheckoutConversion.PaperSub,
			);
	}
}

function checkoutEvents(
	start: SendEventSubscriptionCheckoutStart,
	conversion: SendEventSubscriptionCheckoutConversion,
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

export function sendEventContributionCheckoutConversion(
	amount: number,
	contributionType: ContributionType,
	sourceCurrency: IsoCurrency,
): void {
	void canRunQuantumMetric().then((canRun) => {
		if (canRun) {
			const sendEventWhenReady = () => {
				const sendEventId =
					contributionType === 'ONE_OFF'
						? SendEventContributionCheckoutConversion.SingleContribution
						: SendEventContributionCheckoutConversion.RecurringContribution;
				const convertedValue = getContributionAnnualValue(
					contributionType,
					amount,
					sourceCurrency,
				);
				if (convertedValue) {
					sendEvent(sendEventId, true, convertedValue.toString());
				}
			};

			sendEventWhenReadyTrigger(sendEventWhenReady);
		}
	});
}

export function sendEventContributionAmountUpdated(
	amount: string,
	contributionType: ContributionType,
	sourceCurrency: IsoCurrency,
): void {
	if (amount === 'other' || Number.isNaN(parseInt(amount))) {
		return;
	}

	void canRunQuantumMetric().then((canRun) => {
		if (canRun) {
			const sendEventWhenReady = () => {
				const sendEventId =
					contributionType === 'ONE_OFF'
						? SendEventContributionAmountUpdate.SingleContribution
						: SendEventContributionAmountUpdate.RecurringContribution;
				const convertedValue = getContributionAnnualValue(
					contributionType,
					parseInt(amount),
					sourceCurrency,
				);
				if (convertedValue) {
					sendEvent(sendEventId, false, convertedValue.toString());
				}
			};

			sendEventWhenReadyTrigger(sendEventWhenReady);
		}
	});
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

// ---- initialisation logic ---- //

function addQM() {
	return loadScript(
		'https://cdn.quantummetric.com/instrumentation/1.31.5/quantum-gnm.js',
		{
			async: true,
			integrity:
				'sha384-QqJrp8s9Nl3x7Z6sc9kQG5eYJLVWYwlEsvhjCukLSwFsWtK17WdC5whHVwSXQh1F',
			crossOrigin: 'anonymous',
		},
	).catch(() => {
		logException('Failed to load Quantum Metric');
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
