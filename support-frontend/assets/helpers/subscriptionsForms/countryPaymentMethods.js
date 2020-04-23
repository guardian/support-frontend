// @flow

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { Stripe, PayPal } from 'helpers/paymentMethods';

function supportedPaymentMethods(country: IsoCountry): PaymentMethod[] {
  const countrySpecific: PaymentMethod[] = country === 'GB' ? [Stripe, PayPal] : [Stripe, PayPal];

  return countrySpecific;
}

export { supportedPaymentMethods };
