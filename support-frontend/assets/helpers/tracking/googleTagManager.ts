import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { v4 as uuidv4 } from 'uuid';
import type { ContributionType } from 'helpers/contributions';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import * as storage from 'helpers/storage/storage';
import { getQueryParameter } from 'helpers/urls/url';
import type { PaymentMethod } from '../forms/paymentMethods';
import { DirectDebit, PayPal } from '../forms/paymentMethods';
import { onConsentChangeEvent } from './thirdPartyTrackingConsent';

// ----- Types ----- //
type EventType = 'DataLayerReady' | 'SuccessfulConversion';

type ConversionData = ContributionConversionData | SubscriptionConversionData;

type ContributionConversionData = {
	value: number;
	currency: IsoCurrency;
	paymentMethod: PaymentMethod;
	contributionType: ContributionType;
	productType: ActiveProductKey;
};

type SubscriptionConversionData = {
	value: number;
	currency: IsoCurrency;
	paymentMethod: PaymentMethod;
	billingPeriod: BillingPeriod;
	productType: SubscriptionProduct;
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
	let value: string | null | undefined = storage.getSession('orderId');

	if (value === null) {
		value = uuidv4();
		storage.setSession('orderId', value);
	}

	return value;
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
function mapFields(data: Record<string, unknown>): Record<string, unknown> {
	const { paymentMethod, ...others } = data;
	return {
		paymentMethod: ophanPaymentMethod(
			paymentMethod as PaymentMethod | null | undefined,
		),
		...others,
	};
}

function push(data: Record<string, unknown>) {
	window.googleTagManagerDataLayer = window.googleTagManagerDataLayer ?? [];
	window.googleTagManagerDataLayer.push(mapFields(data));
}

function getData(
	event: EventType,
	conversionData?: ConversionData,
): Record<string, unknown> {
	const commonData = {
		event,
		/**
		 * orderId anonymously identifies this user in this session.
		 * We need this to prevent page refreshes on conversion pages being
		 * treated as new conversions
		 * */
		orderId: getOrderId(),
		/**
		 * getData is only executed via runWithConsentCheck when user has
		 * Opted In to tracking, so we can hardcode thirdPartyTrackingConsent
		 * to "OptedIn".
		 * */
		thirdPartyTrackingConsent: 'OptedIn',
		campaignCodeBusinessUnit: getQueryParameter('CMP_BUNIT') || undefined,
		campaignCodeTeam: getQueryParameter('CMP_TU') || undefined,
		internalCampaignCode: getQueryParameter('INTCMP') || undefined,
		vendorConsentsLookup, // eg. "google-analytics,twitter",
	};

	if (conversionData) {
		return {
			...commonData,
			...conversionData,
		};
	}

	return commonData;
}

function sendData(event: EventType, conversionData?: ConversionData) {
	const pushDataToGTM = () => {
		const dataToPush = getData(event, conversionData);
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

function processQueues() {
	while (googleAnalyticsEventQueue.length > 0) {
		const queuedEvent = googleAnalyticsEventQueue.shift();
		queuedEvent?.();
	}

	while (googleTagManagerDataQueue.length > 0) {
		const queuedEvent = googleTagManagerDataQueue.shift();
		queuedEvent?.();
	}
}

function addTagManagerScript() {
	window.googleTagManagerDataLayer = window.googleTagManagerDataLayer ?? [];
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

	if (firstScript?.parentNode) {
		firstScript.parentNode.insertBefore(googleTagManagerScript, firstScript);
		scriptAdded = true;
	}
}

async function init(): Promise<void> {
	/**
	 * The callback passed to onConsentChangeEvent is called
	 * each time consent changes. EG. if a user consents via the CMP.
	 * The callback will receive the user's consent as the parameter
	 * "thirdPartyTrackingConsent".
	 */
	await onConsentChangeEvent(
		(thirdPartyTrackingConsent: Record<string, boolean>) => {
			// Update vendorConsentsLookup value based on thirdPartyTrackingConsent
			vendorConsentsLookup = Object.keys(thirdPartyTrackingConsent)
				.filter((vendorKey) => thirdPartyTrackingConsent[vendorKey])
				.join(',');

			/**
			 * Update userConsentsToGTM value when
			 * consent changes via the CMP library.
			 */
			userConsentsToGTM =
				thirdPartyTrackingConsent[googleTagManagerKey] ?? false;

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
		},
		vendorIds,
	);
	sendData('DataLayerReady');
}

function successfulContributionConversion(
	amount: number,
	contributionType: ContributionType,
	sourceCurrency: IsoCurrency,
	paymentMethod: PaymentMethod,
	productKey: ActiveProductKey,
): void {
	const contributionConversionData: ContributionConversionData = {
		value: amount,
		currency: sourceCurrency,
		paymentMethod,
		contributionType,
		productType: productKey,
	};

	sendData('SuccessfulConversion', contributionConversionData);
}

// ----- Exports ---//
export { init, successfulContributionConversion };

// ----- For Tests ---//
export const _ = {
	mapFields,
};
