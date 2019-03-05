// @flow

// ----- Imports ----- //

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import React from 'react';

import { type PaymentMethod } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { hiddenIf } from 'helpers/utilities';
import { type SetupPayPalRequestType } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { PayPalExpressButton } from 'components/paypalExpressButton/PayPalExpressButton';
import Button from 'components/button/button';
import { type Option } from 'helpers/types/option';

// ----- Types ----- //

type PropTypes = {|
  paymentMethod: Option<PaymentMethod>,
  currencyId: IsoCurrency,
  csrf: CsrfState,
  setupRecurringPayPalPayment: SetupPayPalRequestType,
  payPalHasLoaded: boolean,
  isTestUser: boolean,
  onPaymentAuthorised: Function,
  amount: number,
  billingPeriod: BillingPeriod,
  validateForm: Function,
  formIsValid: Function,
|};


// ----- Render ----- //


function SubscriptionSubmitButtons(props: PropTypes) {
  return (
    <div>
      <div
        id="component-paypal-button-checkout"
        className={hiddenIf(props.paymentMethod !== 'PayPal', 'component-paypal-button-checkout')}
      >
        <PayPalExpressButton
          onPaymentAuthorisation={props.onPaymentAuthorised}
          csrf={props.csrf}
          currencyId={props.currencyId}
          hasLoaded={props.payPalHasLoaded}
          canOpen={props.formIsValid}
          onClick={props.validateForm}
          formClassName="form--contribution"
          isTestUser={props.isTestUser}
          setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
          amount={props.amount}
          billingPeriod={props.billingPeriod}
        />
      </div>
      <Button
        aria-label={null}
        type="submit"
        modifierClasses={props.paymentMethod === 'PayPal' ? ['hidden'] : []}
      >
        Continue to payment
      </Button>
    </div>
  );
}

export { SubscriptionSubmitButtons };
