// @flow

import { openDialogBox, setupStripeCheckout } from 'helpers/paymentIntegrations/stripeCheckout';

function showPaymentMethod() {
  setupStripeCheckout(alert, null, 'GBP', false)
    .then(() => openDialogBox(10, 'test@test.com'));
}

export {
  showPaymentMethod,
};
