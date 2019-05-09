// @flow

import { loadStripe, openDialogBox, setupStripeCheckout } from 'helpers/paymentIntegrations/stripeCheckout';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';

import type {IsoCurrency} from "./internationalisation/currency";

function showStripe(
  onAuthorised: (pa: PaymentAuthorisation) => void,
  isTestUser: boolean,
  price: number,
  currency: IsoCurrency,
  email: string,
) {
  loadStripe()
    .then(() => setupStripeCheckout(onAuthorised, 'REGULAR', currency, isTestUser))
    .then(stripe => openDialogBox(stripe, price, email));
}

const countrySupportsDirectDebit = (country: ?IsoCountry): boolean => country !== null && country === 'GB';

export { countrySupportsDirectDebit, showStripe };
