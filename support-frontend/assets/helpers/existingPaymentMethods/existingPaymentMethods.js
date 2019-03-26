// @flow

// ----- Imports ----- //
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { fetchJson } from 'helpers/fetch';
import { logException } from '../logger';
import { DirectDebit, ExistingCard, ExistingDirectDebit, Stripe } from '../paymentMethods';
import { getPaymentLabel } from '../checkouts';

// ----- Types ----- //

export type ExistingPaymentMethodSubscription = {
  isActive: boolean;
  isCancelled: boolean,
  name: string
}

type ExistingPaymentType = 'Card' | 'DirectDebit';

export type PartialExistingPaymentMethod = {
  paymentType: ExistingPaymentType;
};

export type FullDetailExistingPaymentMethod = {
  billingAccountId: string,
  subscriptions: ExistingPaymentMethodSubscription[],
  card?: string,
  mandate?: string,
  // can't use Intersection types to avoid repeating this as it breaks isFullDetailExistingPaymentMethod because; Flow!
  paymentType: ExistingPaymentType
};

export type ExistingPaymentMethod = PartialExistingPaymentMethod | FullDetailExistingPaymentMethod;

// ----- Functions ----- //

function isFullDetailExistingPaymentMethod(existingPaymentMethod: ExistingPaymentMethod): boolean %checks {
  return !!existingPaymentMethod.billingAccountId;
}

function sendGetExistingPaymentMethodsRequest(
  isoCurrency: IsoCurrency,
  storeResponse: ExistingPaymentMethod[] => void,
): void {
  fetchJson(
    `${window.guardian.existingPaymentOptionsEndpoint}?currencyFilter=${isoCurrency}`,
    {
      mode: 'cors',
      credentials: 'include',
    },
  )
    .then((jsonResponse) => {
      if (Array.isArray(jsonResponse)) {
        storeResponse(jsonResponse);
      } else {
        throw new Error('existing payment options response was not an array');
      }
    })
    .catch((error) => {
      logException('Failed to get existing payment options', error);
      storeResponse([]);
    });
}

function mapExistingPaymentMethodToPaymentMethod(existingPaymentMethod: FullDetailExistingPaymentMethod) {
  if (existingPaymentMethod.mandate) {
    return ExistingDirectDebit;
  }
  return ExistingCard;
}

function getExistingPaymentMethodLabel(existingPaymentMethod: FullDetailExistingPaymentMethod): string {
  if (existingPaymentMethod.mandate) {
    const last3: string = existingPaymentMethod.mandate.slice(-3);
    return `${getPaymentLabel(DirectDebit)} (account ending ${last3})`;
  }
  if (existingPaymentMethod.card) {
    const last4: string = existingPaymentMethod.card;
    return `${getPaymentLabel(Stripe)} (ending ${last4})`;
  }
  return 'Other Payment Method';
}

function subscriptionToExplainerPart(subscription: ExistingPaymentMethodSubscription) {
  const activeOrRecentPrefix = subscription.isActive ? 'current' : 'recent';
  return `${subscription.isCancelled ? 'recently cancelled' : activeOrRecentPrefix} ${subscription.name}`;
}

function subscriptionsToExplainerList(subscriptionParts: string[]) {
  return (subscriptionParts.slice(0, -1).join(', ').concat(subscriptionParts.length > 1 ? ' and ' : '', subscriptionParts.slice(-1)[0]));
}

export {
  sendGetExistingPaymentMethodsRequest,
  isFullDetailExistingPaymentMethod,
  mapExistingPaymentMethodToPaymentMethod,
  getExistingPaymentMethodLabel,
  subscriptionToExplainerPart,
  subscriptionsToExplainerList,
};
