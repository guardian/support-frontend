// @flow

import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

function supportedPaymentMethods(currencyId: IsoCurrency) {
  const countrySpecific: PaymentMethod[] = currencyId === 'GBP' ? [DirectDebit, Stripe, PayPal] : [Stripe, PayPal];

  return countrySpecific;
}

export { supportedPaymentMethods };
