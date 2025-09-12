// ----- Routes ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	FulfilmentOptions,
	PaperFulfilmentOptions,
} from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import type { Option } from 'helpers/types/option';
import {
	addQueryParamsToURL,
	getAllQueryParams,
	getOrigin,
	isProd,
} from './url';

const routes = {
	recurringContribCheckout: '/contribute/recurring',
	recurringContribCreate: '/contribute/recurring/create',
	recurringContribPending: '/contribute/recurring/pending',
	contributionsSendMarketing: '/contribute/send-marketing',
	getUserType: '/identity/get-user-type',
	contributionsMarketingConfirm: '/contribute/marketing-confirm',
	payPalSetupPayment: '/paypal/setup-payment',
	payPalCreateAgreement: '/paypal/create-agreement',
	payPalOneClickCheckout: '/paypal/one-click-checkout',
	directDebitCheckAccount: '/direct-debit/check-account',
	payPalRestReturnURL: '/paypal/rest/return',
	subscriptionCreate: '/subscribe/create',
	subscriptionsLanding: '/subscribe',
	checkout: '/checkout',
	digitalSubscriptionLanding: '/subscribe/digitaledition',
	paperSubscriptionLanding: '/subscribe/paper',
	paperSubscriptionProductChoices: '/subscribe/paper#HomeDelivery',
	paperSubscriptionDeliveryProductChoices:
		'/subscribe/paper/delivery#HomeDelivery',
	guardianWeeklySubscriptionLanding: '/subscribe/weekly',
	guardianWeeklySubscriptionLandingGift: '/subscribe/weekly/gift',
	guardianWeeklyStudentUK:
		'https://connect.studentbeans.com/v4/hosted/the-guardian-weekly/uk',
	guardianWeeklyStudentAU:
		'https://connect.studentbeans.com/v4/hosted/the-guardian-weekly/au',
	postcodeLookup: '/postcode-lookup',
	createSignInUrl: '/identity/signin-url',
	stripeSetupIntentRecaptcha: '/stripe/create-setup-intent/recaptcha',
} as const;
const createOneOffReminderEndpoint = isProd()
	? 'https://support.theguardian.com/reminders/create/one-off'
	: 'https://support.code.dev-theguardian.com/reminders/create/one-off';
const createRecurringReminderEndpoint = isProd()
	? 'https://support.theguardian.com/reminders/create/recurring'
	: 'https://support.code.dev-theguardian.com/reminders/create/recurring';

const countryPath = (countryGroupId: CountryGroupId) =>
	countryGroups[countryGroupId].supportInternationalisationId;

function postcodeLookupUrl(postcode: string): string {
	return `${getOrigin() + routes.postcodeLookup}/${postcode}`;
}

function paperSubsUrl(
	paperFulfulmentOption?: PaperFulfilmentOptions,
	promoCode?: Option<string>,
): string {
	const baseURL = [getOrigin(), 'uk/subscribe/paper'].join('/');
	const queryParams = [
		...getAllQueryParams(),
		...(promoCode ? [['promoCode', promoCode]] : []),
	];
	const queryParamsString = queryParams
		.map((keyValuePair) => keyValuePair.join('='))
		.join('&');

	const hash = paperFulfulmentOption ? `#${paperFulfulmentOption}` : '';

	if (queryParamsString) {
		return `${baseURL}?${queryParamsString}${hash}`;
	}

	return baseURL;
}

function digitalSubscriptionLanding(
	countryGroupId: CountryGroupId,
	billingPeriod?: BillingPeriod,
) {
	const routeDigitalSubscription = `${
		routes.checkout
	}?product=DigitalSubscription&ratePlan=${billingPeriod ?? 'Monthly'}`;
	return `${getOrigin()}/${countryPath(
		countryGroupId,
	)}${routeDigitalSubscription}`;
}

function guardianWeeklyLanding(countryGroupId: CountryGroupId, gift: boolean) {
	return `${getOrigin()}/${countryPath(countryGroupId)}${
		gift
			? routes.guardianWeeklySubscriptionLandingGift
			: routes.guardianWeeklySubscriptionLanding
	}`;
}

const promotionTermsUrl = (promoCode: string) =>
	`${getOrigin()}/p/${promoCode}/terms`;

function paperCheckoutUrl(
	fulfilmentOption: FulfilmentOptions,
	productOptions: ProductOptions,
	promoCode?: Option<string>,
	abTestName?: string,
) {
	const url = `${getOrigin()}/uk/checkout`;

	const params = abTestName
		? {
				[abTestName]: 'true',
				promoCode,
				product:
					fulfilmentOption === 'Collection'
						? 'SubscriptionCard'
						: fulfilmentOption,
				ratePlan: productOptions,
		  }
		: {
				promoCode,
				product:
					fulfilmentOption === 'Collection'
						? 'SubscriptionCard'
						: fulfilmentOption,
				ratePlan: productOptions,
		  };

	return addQueryParamsToURL(url, params);
}

function parameteriseUrl(
	url: string,
	promoCode?: Option<string>,
	abTestName?: string,
	fulfilmentOption?: PaperFulfilmentOptions,
) {
	const params = abTestName
		? {
				[abTestName]: 'true',
				promoCode,
		  }
		: {
				promoCode,
		  };
	const urlWithParams = addQueryParamsToURL(url, params).replace(/([?])$/g, ''); // removes ? when no params
	const validFulfilmentOption =
		url.includes('subscribe/paper') && fulfilmentOption; // limit to paper subs landing page
	return validFulfilmentOption
		? `${urlWithParams}#${fulfilmentOption}`
		: urlWithParams;
}

// If the user cancels before completing the payment flow, send them back to the contribute page.
function payPalCancelUrl(cgId: CountryGroupId): string {
	return `${getOrigin()}/${countryPath(cgId)}/contribute`;
}

function payPalReturnUrl(
	cgId: CountryGroupId,
	email: string,
	route: string = '/paypal/rest/return',
): string {
	return `${getOrigin()}/${countryPath(
		cgId,
	)}${route}?email=${encodeURIComponent(email)}`;
}

// ----- Exports ----- //
export {
	routes,
	createOneOffReminderEndpoint,
	createRecurringReminderEndpoint,
	postcodeLookupUrl,
	payPalCancelUrl,
	payPalReturnUrl,
	paperSubsUrl,
	paperCheckoutUrl,
	parameteriseUrl,
	digitalSubscriptionLanding,
	guardianWeeklyLanding,
	promotionTermsUrl,
};
