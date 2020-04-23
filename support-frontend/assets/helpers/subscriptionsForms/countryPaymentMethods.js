// @flow

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, Stripe, PayPal } from 'helpers/paymentMethods';

function supportedPaymentMethods(country: IsoCountry): PaymentMethod[] {
  const countrySpecific: PaymentMethod[] = country === 'GB' ? [DirectDebit, Stripe, PayPal] : [Stripe, PayPal];

  return countrySpecific;
}

export { supportedPaymentMethods };
