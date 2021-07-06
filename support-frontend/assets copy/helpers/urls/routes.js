// @flow

// ----- Routes ----- //

import { countryGroups, type CountryGroupId } from '../internationalisation/countryGroup';
import { getOrigin, isProd } from './url';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { type Option } from 'helpers/types/option';

const routes: {
  [string]: string,
} = {
  recurringContribCheckout: '/contribute/recurring',
  recurringContribCreate: '/contribute/recurring/create',
  recurringContribPending: '/contribute/recurring/pending',
  contributionsSendMarketing: '/contribute/send-marketing',
  contributionsSetPasswordGuest: '/identity/set-password-guest',
  getUserType: '/identity/get-user-type',
  oneOffContribAutofill: '/contribute/one-off/autofill',
  contributionsMarketingConfirm: '/contribute/marketing-confirm',
  payPalSetupPayment: '/paypal/setup-payment',
  payPalCreateAgreement: '/paypal/create-agreement',
  directDebitCheckAccount: '/direct-debit/check-account',
  payPalRestReturnURL: '/paypal/rest/return',
  subscriptionCreate: '/subscribe/create',
  showcase: '/support',
  subscriptionsLanding: '/subscribe',
  digitalSubscriptionLanding: '/subscribe/digital',
  digitalSubscriptionLandingGift: '/subscribe/digital/gift',
  paperSubscriptionLanding: '/subscribe/paper',
  paperSubscriptionProductChoices: '/subscribe/paper#subscribe',
  paperSubscriptionDeliveryProductChoices: '/subscribe/paper/delivery#subscribe',
  guardianWeeklySubscriptionLanding: '/subscribe/weekly',
  guardianWeeklySubscriptionLandingGift: '/subscribe/weekly/gift',
  postcodeLookup: '/postcode-lookup',
  createSignInUrl: '/identity/signin-url',
  stripeSetupIntentRecaptcha: '/stripe/create-setup-intent/recaptcha',
};

const createOneOffReminderEndpoint = isProd() ?
  'https://support.theguardian.com/reminders/create/one-off' : 'https://support.code.dev-theguardian.com/reminders/create/one-off';
const createRecurringReminderEndpoint = isProd() ?
  'https://support.theguardian.com/reminders/create/recurring' : 'https://support.code.dev-theguardian.com/reminders/create/recurring';

const countryPath = (countryGroupId: CountryGroupId) =>
  countryGroups[countryGroupId].supportInternationalisationId;

function postcodeLookupUrl(postcode: string): string {
  return `${getOrigin() + routes.postcodeLookup}/${postcode}`;
}

function paperSubsUrl(withDelivery: boolean = false, promoCode?: Option<string>): string {
  const baseURL = [getOrigin(), 'uk/subscribe/paper', ...(withDelivery ? ['delivery'] : [])].join('/');
  if (promoCode) {
    return `${baseURL}?promoCode=${promoCode}`;
  }
  return baseURL;
}

function digitalSubscriptionLanding(countryGroupId: CountryGroupId, gift: boolean) {
  return `${getOrigin()}/${countryPath(countryGroupId)}${gift ? routes.digitalSubscriptionLandingGift : routes.digitalSubscriptionLanding}`;
}

function guardianWeeklyLanding(countryGroupId: CountryGroupId, gift: boolean) {
  return `${getOrigin()}/${countryPath(countryGroupId)}${gift ? routes.guardianWeeklySubscriptionLandingGift : routes.guardianWeeklySubscriptionLanding}`;
}

const promotionTermsUrl = (promoCode: string) => `${getOrigin()}/p/${promoCode}/terms`;

function paperCheckoutUrl(
  fulfilmentOption: FulfilmentOptions,
  productOptions: ProductOptions,
  promoCode?: Option<string>,
) {
  return promoCode ?
    `${getOrigin()}/subscribe/paper/checkout?fulfilment=${fulfilmentOption}&product=${productOptions}&promoCode=${promoCode}`
    : `${getOrigin()}/subscribe/paper/checkout?fulfilment=${fulfilmentOption}&product=${productOptions}`;
}

// If the user cancels before completing the payment flow, send them back to the contribute page.
function payPalCancelUrl(cgId: CountryGroupId): string {
  return `${getOrigin()}/${countryPath(cgId)}/contribute`;
}

function payPalReturnUrl(cgId: CountryGroupId, email: string): string {
  return `${getOrigin()}/${countryPath(cgId)}/paypal/rest/return?email=${encodeURIComponent(email)}`;
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
  digitalSubscriptionLanding,
  guardianWeeklyLanding,
  promotionTermsUrl,
};
