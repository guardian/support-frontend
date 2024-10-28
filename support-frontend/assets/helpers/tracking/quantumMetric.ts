import { loadScript } from '@guardian/libs';
import { viewId } from 'ophan';
import type { Participations } from 'helpers/abTests/abtest';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ProductKey } from 'helpers/productCatalog';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { logException } from 'helpers/utilities/logger';
import type { ReferrerAcquisitionData } from './acquisitions';
import {
	canRunQuantumMetric,
	getContributionAnnualValue,
	getConvertedAnnualValue,
	getConvertedValue,
	getSubscriptionAnnualValue,
	waitForQuantumMetricAPi,
} from './quantumMetricHelpers';

// ---- Types ---- //

type SendEventTestParticipationId = 30;

type SendEventPageViewId = 181;

type SendEventCheckoutValueId = 182;

enum SendEventAcquisitionDataFromQueryParam {
	Source = 94,
	ComponentId = 95,
	ComponentType = 96,
	CampaignCode = 97,
	ReferrerUrl = 99,
	IsRemote = 100,
}

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

enum SendEventContributionPaymentMethodUpdate {
	PaymentMethod = 103,
	PaymentMethodAtConversion = 110,
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
	| SendEventContributionCheckoutConversion
	| SendEventContributionPaymentMethodUpdate
	| SendEventAcquisitionDataFromQueryParam
	| SendEventPageViewId
	| SendEventCheckoutValueId;

// ---- sendEvent logic ---- //

const {
	DigiSub,
	PaperSub,
	GuardianWeeklySub,
	DigiSubGift,
	GuardianWeeklySubGift,
} = SendEventSubscriptionCheckoutStart;

const { SingleContribution, RecurringContribution } =
	SendEventContributionAmountUpdate;

const cartValueEventIds: SendEventId[] = [
	DigiSub,
	PaperSub,
	GuardianWeeklySub,
	DigiSubGift,
	GuardianWeeklySubGift,
	SingleContribution,
	RecurringContribution,
];

async function ifQmPermitted(callback: () => void) {
	const canRun = await canRunQuantumMetric();

	if (canRun) {
		callback();
	}
}

function sendEvent(
	id: SendEventId,
	isConversion: boolean,
	value: string,
	payload?: Record<string, unknown>,
): void {
	/**
	 * A cart value event is indicated by 64 in QM.
	 * A non cart value event is indicated by 0 in QM.
	 * And a conversion event is indicated by 1 in QM.
	 */
	const qmCartValueEventId = isConversion
		? 1
		: cartValueEventIds.includes(id)
		? 64
		: 0;
	if (window.QuantumMetricAPI?.isOn()) {
		console.log('*** sendEvent ***', id, qmCartValueEventId, value, payload);
		if (payload) {
			window.QuantumMetricAPI.sendEvent(id, qmCartValueEventId, value, payload);
		} else {
			window.QuantumMetricAPI.sendEvent(id, qmCartValueEventId, value);
		}
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

function sendEventAcquisitionDataFromQueryParamEvent(
	acquisitionData: ReferrerAcquisitionData,
): void {
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			type ReferrerAcquisitionDataKeysToLogType = Record<string, number>;
			const acquisitionDataKeysToLog: ReferrerAcquisitionDataKeysToLogType = {
				source: SendEventAcquisitionDataFromQueryParam.Source,
				componentId: SendEventAcquisitionDataFromQueryParam.ComponentId,
				componentType: SendEventAcquisitionDataFromQueryParam.ComponentType,
				campaignCode: SendEventAcquisitionDataFromQueryParam.CampaignCode,
				referrerUrl: SendEventAcquisitionDataFromQueryParam.ReferrerUrl,
				isRemote: SendEventAcquisitionDataFromQueryParam.IsRemote,
			};
			Object.keys(acquisitionDataKeysToLog).forEach((key) => {
				const acquisitionDataValueToLog =
					acquisitionData[key as keyof ReferrerAcquisitionData]?.toString();
				if (acquisitionDataValueToLog) {
					sendEvent(
						acquisitionDataKeysToLog[key],
						false,
						acquisitionDataValueToLog.toString(),
					);
				}
			});
		};

		sendEventWhenReadyTrigger(sendEventWhenReady);
	});
}

function sendEventSubscriptionCheckoutEvent(
	id:
		| SendEventSubscriptionCheckoutStart
		| SendEventSubscriptionCheckoutConversion,
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
	isConversion: boolean,
): void {
	void ifQmPermitted(() => {
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
				sendEvent(id, isConversion, Math.round(convertedValue).toString());
			}
		};

		sendEventWhenReadyTrigger(sendEventWhenReady);
	});
}

function productToCheckoutEvents(
	product: SubscriptionProduct,
	orderIsAGift: boolean,
):
	| {
			start: SendEventSubscriptionCheckoutStart;
			conversion: SendEventSubscriptionCheckoutConversion;
	  }
	| undefined {
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
		default:
			return;
	}
}

function checkoutEvents(
	start: SendEventSubscriptionCheckoutStart,
	conversion: SendEventSubscriptionCheckoutConversion,
) {
	return { start, conversion };
}

function sendEventSubscriptionCheckoutStart(
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

function sendEventSubscriptionCheckoutConversion(
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

function sendEventOneTimeCheckoutValue(
	amount: number,
	sourceCurrency: IsoCurrency,
): void {
	console.log('*** sendEventOneTimeCheckoutValue ***', amount, sourceCurrency);
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			const sendEventId = 182;
			const convertedValue = getConvertedValue(amount, sourceCurrency);

			const payload = {
				product: 'ONE-OFF',
			};

			if (convertedValue) {
				sendEvent(
					sendEventId,
					false,
					Math.round(convertedValue).toString(),
					payload,
				);
			}
		};
		sendEventWhenReadyTrigger(sendEventWhenReady);
	});
}

function sendEventCheckoutValue(
	amount: number,
	product: ProductKey,
	billingPeriod: BillingPeriod,
	sourceCurrency: IsoCurrency,
): void {
	console.log(
		'*** sendEventCheckoutValue ***',
		amount,
		product,
		billingPeriod,
		sourceCurrency,
	);
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			const sendEventId = 182;
			const convertedValue = getConvertedAnnualValue(
				billingPeriod,
				amount,
				sourceCurrency,
			);
			const payload = {
				product,
				billingPeriod,
			};
			if (convertedValue) {
				sendEvent(
					sendEventId,
					false,
					Math.round(convertedValue).toString(),
					payload,
				);
			}
		};
		sendEventWhenReadyTrigger(sendEventWhenReady);
	});
}

// TODO: To be deleted with the 2-step checkout
function sendEventContributionCheckoutConversion(
	amount: number,
	contributionType: ContributionType,
	sourceCurrency: IsoCurrency,
): void {
	void ifQmPermitted(() => {
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
				sendEvent(sendEventId, true, Math.round(convertedValue).toString());
			}
		};
		sendEventWhenReadyTrigger(sendEventWhenReady);
	});
}

// TODO: To be deleted with the 2-step checkout
function sendEventContributionCartValue(
	amount: string,
	contributionType: ContributionType,
	sourceCurrency: IsoCurrency,
): void {
	if (amount === 'other' || Number.isNaN(parseInt(amount))) {
		return;
	}
	void ifQmPermitted(() => {
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
				sendEvent(sendEventId, false, Math.round(convertedValue).toString());
			}
		};
		sendEventWhenReadyTrigger(sendEventWhenReady);
	});
}

function sendEventPaymentMethodSelected(
	paymentMethod: PaymentMethod | 'StripeExpressCheckoutElement' | null,
): void {
	if (paymentMethod) {
		void ifQmPermitted(() => {
			const sendEventWhenReady = () => {
				const sendEventId =
					SendEventContributionPaymentMethodUpdate.PaymentMethod;
				sendEvent(sendEventId, false, paymentMethod.toString());
			};

			sendEventWhenReadyTrigger(sendEventWhenReady);
		});
	}
}

function sendEventConversionPaymentMethod(paymentMethod: PaymentMethod): void {
	void ifQmPermitted(() => {
		sendEventWhenReadyTrigger(() =>
			sendEvent(
				SendEventContributionPaymentMethodUpdate.PaymentMethodAtConversion,
				false,
				paymentMethod.toString(),
			),
		);
	});
}

function sendEventABTestParticipations(participations: Participations): void {
	const sendEventABTestId: SendEventTestParticipationId = 30;
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

function sendEventPageViewId(): void {
	const sendEventPageViewId: SendEventPageViewId = 181;
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			sendEvent(sendEventPageViewId, false, viewId);
		};
		sendEventWhenReadyTrigger(sendEventWhenReady);
	});
}

// ---- initialisation logic ---- //

function addQM() {
	return loadScript(
		'https://cdn.quantummetric.com/instrumentation/1.35.4/quantum-gnm.js',
		{
			async: true,
			integrity:
				'sha384-VMLIC70VzACtZAEkPaL+7xW+v0+UjkIUuGxlArtIG+Pzqlp5DkbfVG9tRm75Liwx',
			crossOrigin: 'anonymous',
		},
	).catch(() => {
		logException('Failed to load Quantum Metric');
	});
}

function init(
	participations: Participations,
	acquisitionData: ReferrerAcquisitionData,
): void {
	void ifQmPermitted(() => {
		void addQM().then(() => {
			/**
			 * Quantum Metric's script has loaded so we can attempt to
			 * send user AB test participations, acquisition data and
			 * the current page view ID via the sendEvent function.
			 */
			sendEventABTestParticipations(participations);
			sendEventAcquisitionDataFromQueryParamEvent(acquisitionData);
			sendEventPageViewId();
		});
	});
}
// ----- Exports ----- //
export {
	init,
	sendEventSubscriptionCheckoutStart,
	sendEventSubscriptionCheckoutConversion,
	sendEventContributionCheckoutConversion,
	sendEventContributionCartValue,
	sendEventPaymentMethodSelected,
	sendEventConversionPaymentMethod,
	sendEventAcquisitionDataFromQueryParamEvent,
	sendEventCheckoutValue,
	sendEventOneTimeCheckoutValue,
};
