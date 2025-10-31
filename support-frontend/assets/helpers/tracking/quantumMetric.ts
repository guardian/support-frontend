import { loadScript } from '@guardian/libs';
import { viewId } from '@guardian/ophan-tracker-js/support';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { Participations } from 'helpers/abTests/models';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { logException } from 'helpers/utilities/logger';
import { getMvtId } from '../abTests/mvt';
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
type SendEventCheckoutConversionId = 183;

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
	GuardianWeeklySubGift = 79,
}

enum SendEventSubscriptionCheckoutConversion {
	DigiSub = 31,
	PaperSub = 67,
	GuardianWeeklySub = 68,
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
	| SendEventCheckoutValueId
	| SendEventCheckoutConversionId;

// ---- sendEvent logic ---- //

const { DigiSub, PaperSub, GuardianWeeklySub, GuardianWeeklySubGift } =
	SendEventSubscriptionCheckoutStart;

const { SingleContribution, RecurringContribution } =
	SendEventContributionAmountUpdate;

const cartValueEventIds: SendEventId[] = [
	DigiSub,
	PaperSub,
	GuardianWeeklySub,
	GuardianWeeklySubGift,
	SingleContribution,
	RecurringContribution,
];

// We only want to send a sample percentage of our user traffic to Quantum Metric.
function userIsInSampledCohort(): boolean {
	const percentageOfUsersToSample = 10;
	const divisor = 100 / percentageOfUsersToSample;

	const mvtId = getMvtId();
	return mvtId % divisor === 0;
}

async function ifQmPermitted(callback: () => void) {
	const canRun = await canRunQuantumMetric();

	if (canRun && userIsInSampledCohort()) {
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
		window.QuantumMetricAPI.sendEvent(
			id,
			qmCartValueEventId,
			value,
			payload ?? {},
		);
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
				const acquisitionDataValueToLog = JSON.stringify(
					acquisitionData[key as keyof ReferrerAcquisitionData],
				);
				if (acquisitionDataValueToLog && acquisitionDataKeysToLog[key]) {
					sendEvent(
						acquisitionDataKeysToLog[key] ?? 0,
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
			return checkoutEvents(
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
	isConversion?: boolean,
): void {
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			const sendEventId = isConversion ? 183 : 182;
			const convertedValue = getConvertedValue(amount, sourceCurrency);

			const payload = {
				product: 'ONE-OFF',
			};

			if (convertedValue) {
				sendEvent(
					sendEventId,
					!!isConversion,
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
	product: ActiveProductKey,
	billingPeriod: BillingPeriod,
	sourceCurrency: IsoCurrency,
	isConversion?: boolean,
): void {
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			const sendEventId = isConversion ? 183 : 182;
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
					!!isConversion,
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
	billingPeriod: BillingPeriod,
	sourceCurrency: IsoCurrency,
): void {
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			const sendEventId =
				billingPeriod === BillingPeriod.OneTime
					? SendEventContributionCheckoutConversion.SingleContribution
					: SendEventContributionCheckoutConversion.RecurringContribution;
			const convertedValue = getContributionAnnualValue(
				billingPeriod,
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
	billingPeriod: BillingPeriod,
	sourceCurrency: IsoCurrency,
): void {
	if (amount === 'other' || Number.isNaN(parseInt(amount))) {
		return;
	}
	void ifQmPermitted(() => {
		const sendEventWhenReady = () => {
			const sendEventId =
				billingPeriod === BillingPeriod.OneTime
					? SendEventContributionAmountUpdate.SingleContribution
					: SendEventContributionAmountUpdate.RecurringContribution;
			const convertedValue = getContributionAnnualValue(
				billingPeriod,
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
	sendEventCheckoutValue,
	sendEventOneTimeCheckoutValue,
};
