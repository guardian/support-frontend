import uuidv4 from 'uuid';
import type { Participations } from 'helpers/abTests/abtest';
import { getVariantsAsString } from 'helpers/abTests/abtest';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage/storage';
import { getQueryParameter } from 'helpers/urls/url';
import type { PaymentMethod } from '../forms/paymentMethods';
import { DirectDebit, PayPal } from '../forms/paymentMethods';
import { onConsentChangeEvent } from './thirdPartyTrackingConsent';
// ----- Types ----- //
type EventType =
	| 'DataLayerReady'
	| 'SuccessfulConversion'
	| 'GAEvent'
	| 'AppStoreCtaClick';
type PaymentRequestAPIStatus =
	| 'PaymentRequestAPINotAvailable'
	| 'CanMakePaymentNotAvailable'
	| 'AvailableNotInUse'
	| 'AvailableInUse'
	| 'PaymentRequestAPIError'
	| 'PromiseNotSupported'
	| 'PromiseRejected'
	| 'PaymentApiPromiseRejected';
type GaEventData = {
	category: string;
	action: string;
	label: string | null | undefined;
};
// these values match the keys used by @guardian/consent-management-platform
const googleTagManagerKey = 'google-tag-manager';
const googleAnalyticsKey = 'google-analytics';
const googleRemarketingKey = 'remarketing';
const facebookKey = 'fb';
const twitterKey = 'twitter';
const bingKey = 'bing';
const vendorIds: Record<string, string> = {
	[googleTagManagerKey]: '5e952f6107d9d20c88e7c975',
	[googleAnalyticsKey]: '5e542b3a4cd8884eb41b5a72',
	[googleRemarketingKey]: '5ed0eb688a76503f1016578f',
	[facebookKey]: '5e7e1298b8e05c54a85c52d2',
	[twitterKey]: '5e71760b69966540e4554f01',
	[bingKey]: '5f353ea3f8baf8390b95ffd4',
};
const gaPropertyId = 'UA-51507017-5';

/**
 * vendorConsentsLookup is a string we
 * pass to GTM, it as a comma delimited list
 * of vendor keys we query in GTM before
 * adding tags
 *
 */
let vendorConsentsLookup = '';
// Default userConsentsToGTM to false
let userConsentsToGTM = false;
// Default scriptAdded to false
let scriptAdded = false;
// Default scriptReady to false
let scriptReady = false;
// We store tracking events in these queues when userConsentsToGTM is false
const googleTagManagerDataQueue: Array<() => void> = [];
const googleAnalyticsEventQueue: Array<() => void> = [];

// ----- Functions ----- //
function getOrderId() {
	let value = storage.getSession('orderId');

	if (value === null) {
		value = uuidv4();
		storage.setSession('orderId', value);
	}

	return value;
}

function getCurrency(): string {
	const currency = detectCurrency(detectCountryGroup());

	if (currency) {
		storage.setSession('currency', currency);
	}

	return storage.getSession('currency') || 'GBP';
}

function getContributionValue(): number {
	const param = getQueryParameter('contributionValue');

	if (param) {
		storage.setSession('contributionValue', String(parseFloat(param)));
	}

	return parseFloat(storage.getSession('contributionValue')) || 0;
}

function getPaymentAPIStatus(): Promise<PaymentRequestAPIStatus> {
	return new Promise((resolve) => {
		try {
			const { PaymentRequest } = window;

			if (typeof PaymentRequest !== 'function') {
				resolve('PaymentRequestAPINotAvailable');
			}

			const supportedInstruments = [
				{
					supportedMethods: 'basic-card',
					data: {
						supportedNetworks: [
							'visa',
							'mastercard',
							'amex',
							'jcb',
							'diners',
							'discover',
							'mir',
							'unionpay',
						],
						supportedTypes: ['credit', 'debit'],
					},
				},
			];
			const details = {
				total: {
					label: 'tracking',
					amount: {
						value: '1',
						currency: getCurrency(),
					},
				},
			};
			const request = new PaymentRequest(supportedInstruments, details);

			if (request && !request.canMakePayment) {
				resolve('CanMakePaymentNotAvailable');
			}

			request
				.canMakePayment()
				.then((result) => {
					if (result) {
						resolve('AvailableInUse');
					} else {
						resolve('AvailableNotInUse');
					}
				})
				.catch(() => {
					resolve('PaymentApiPromiseRejected');
				});
		} catch (e) {
			resolve('PaymentRequestAPIError');
		}
	});
}

function ophanPaymentMethod(paymentMethod: PaymentMethod | null | undefined) {
	switch (paymentMethod) {
		case DirectDebit:
			return 'Gocardless';

		case PayPal:
			return 'Paypal';

		default:
			return paymentMethod;
	}
}

// Perform any conversions on the data being sent
// for instance we need to convert the payment method
// from our PaymentMethod type to Ophan's type so that
// it is consistent with the conversion data from
// the acquisition-event-producer library
function mapFields(data: Record<string, any>) {
	const { paymentMethod, ...others } = data;
	return {
		paymentMethod: ophanPaymentMethod(paymentMethod),
		...others,
	};
}

function push(data: Record<string, any>) {
	window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];
	window.googleTagManagerDataLayer.push(mapFields(data));
}

function getData(
	event: EventType,
	participations: Participations,
	paymentRequestApiStatus?: PaymentRequestAPIStatus,
): Record<string, any> {
	const orderId = getOrderId();
	const value = getContributionValue();
	const currency = getCurrency();
	return {
		event,

		/**
		 * orderId anonymously identifies this user in this session.
		 * We need this to prevent page refreshes on conversion pages being
		 * treated as new conversions
		 * */
		orderId,
		currency,
		value,

		/**
		 * getData is only executed via runWithConsentCheck when user has
		 * Opted In to tracking, so we can hardcode thirdPartyTrackingConsent
		 * to "OptedIn".
		 * */
		thirdPartyTrackingConsent: 'OptedIn',
		paymentMethod: storage.getSession('selectedPaymentMethod') || undefined,
		campaignCodeBusinessUnit: getQueryParameter('CMP_BUNIT') || undefined,
		campaignCodeTeam: getQueryParameter('CMP_TU') || undefined,
		internalCampaignCode: getQueryParameter('INTCMP') || undefined,
		experience: getVariantsAsString(participations),
		paymentRequestApiStatus,
		vendorConsentsLookup, // eg. "google-analytics,twitter"
	};
}

function sendData(
	event: EventType,
	participations: Participations,
	paymentRequestApiStatus?: PaymentRequestAPIStatus,
) {
	const pushDataToGTM = () => {
		const dataToPush = getData(event, participations, paymentRequestApiStatus);
		push(dataToPush);
	};

	/**
	 * If userConsentsToGTM and scriptReady process event immediately,
	 * else add to googleTagManagerDataQueue.
	 */
	if (userConsentsToGTM && scriptReady) {
		pushDataToGTM();
	} else {
		googleTagManagerDataQueue.push(pushDataToGTM);
	}
}

function pushToDataLayer(event: EventType, participations: Participations) {
	try {
		getPaymentAPIStatus()
			.then((paymentRequestApiStatus) => {
				sendData(event, participations, paymentRequestApiStatus);
			})
			.catch(() => {
				sendData(event, participations, 'PromiseRejected');
			});
	} catch (e) {
		sendData(event, participations, 'PromiseNotSupported');
	}
}

function processQueues() {
	while (googleAnalyticsEventQueue.length > 0) {
		const queuedEvent = googleAnalyticsEventQueue.shift();
		queuedEvent();
	}

	while (googleTagManagerDataQueue.length > 0) {
		const queuedEvent = googleTagManagerDataQueue.shift();
		queuedEvent();
	}
}

function addTagManagerScript() {
	window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];
	window.googleTagManagerDataLayer.push({
		'gtm.start': new Date().getTime(),
		event: 'gtm.js',
	});
	const firstScript = document.getElementsByTagName('script')[0];
	const googleTagManagerScript = document.createElement('script');
	googleTagManagerScript.defer = true;
	googleTagManagerScript.src =
		'https://www.googletagmanager.com/gtm.js?id=GTM-W6GJ68L&l=googleTagManagerDataLayer';

	/**
	 * After Google Tag Manager has loaded we can
	 * process pending events in googleAnalyticsEventQueue and
	 * googleTagManagerDataQueue if userConsentsToGTM.
	 * This also clears the queues as it executes each function in them.
	 */
	googleTagManagerScript.onload = () => {
		scriptReady = true;
		processQueues();
	};

	if (firstScript && firstScript.parentNode) {
		firstScript.parentNode.insertBefore(googleTagManagerScript, firstScript);
		scriptAdded = true;
	}
}

function init(participations: Participations) {
	/**
	 * The callback passed to onConsentChangeEvent is called
	 * each time consent changes. EG. if a user consents via the CMP.
	 * The callback will receive the user's consent as the parameter
	 * "thirdPartyTrackingConsent".
	 */
	onConsentChangeEvent((thirdPartyTrackingConsent: Record<string, boolean>) => {
		// Update vendorConsentsLookup value based on thirdPartyTrackingConsent
		vendorConsentsLookup = Object.keys(thirdPartyTrackingConsent)
			.filter((vendorKey) => thirdPartyTrackingConsent[vendorKey])
			.join(',');

		/**
		 * Update userConsentsToGTM value when
		 * consent changes via the CMP library.
		 */
		userConsentsToGTM = thirdPartyTrackingConsent[googleTagManagerKey];

		if (userConsentsToGTM) {
			if (!scriptAdded) {
				/**
				 * Instruction for Google Analytics
				 * to leverage the TCFv2 framework
				 */
				window.gtag_enable_tcf_support = true;

				/**
				 * Add Google Tag Manager script to the page
				 * If it hasn't been added already.
				 */
				addTagManagerScript();
			} else {
				/**
				 * If Google Tag Manager script has benn added already process pending events
				 * in googleAnalyticsEventQueue and googleTagManagerDataQueue. This also
				 * clears the queues as it executes each function in them.
				 */
				processQueues();
			}
		}
	}, vendorIds);
	pushToDataLayer('DataLayerReady', participations);
}

function successfulConversion(participations: Participations) {
	sendData('SuccessfulConversion', participations);
}

function gaEvent(
	gaEventData: GaEventData,
	additionalFields: Record<string, any> | null | undefined,
) {
	const pushEventToGA = () => {
		push({
			event: 'GAEvent',
			eventCategory: gaEventData.category,
			eventAction: gaEventData.action,
			eventLabel: gaEventData.label,
			...additionalFields,
		});
	};

	/**
	 * If userConsentsToGTM and scriptReady then process event immediately,
	 * else add to googleAnalyticsEventQueue.
	 */
	if (userConsentsToGTM && scriptReady) {
		pushEventToGA();
	} else {
		googleAnalyticsEventQueue.push(pushEventToGA);
	}
}

function appStoreCtaClick() {
	sendData('AppStoreCtaClick', {
		TestName: '',
	});
}

// ----- Exports ---//
export {
	init,
	gaEvent,
	successfulConversion,
	appStoreCtaClick,
	gaPropertyId,
	mapFields,
};
