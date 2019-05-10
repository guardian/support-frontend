// @flow

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import type { Option } from 'helpers/types/option';

function supportedPaymentMethods(country: IsoCountry, product: SubscriptionProduct): PaymentMethod[] {
  const productSpecific: PaymentMethod[] = product === 'DigitalPack' ? [PayPal] : [];

  if (country === 'GB') {
    return [DirectDebit, Stripe].concat(productSpecific);
  }

  return [Stripe].concat(productSpecific);
}

// When there is more than one payment method available for a given country and product type we do not want
// to provide a default, however when there is only one, we do.
const defaultPaymentMethod = (country: IsoCountry, product: SubscriptionProduct): Option<PaymentMethod> =>
  (supportedPaymentMethods(country, product).length > 1 ? null : Stripe);

export { supportedPaymentMethods, defaultPaymentMethod };
