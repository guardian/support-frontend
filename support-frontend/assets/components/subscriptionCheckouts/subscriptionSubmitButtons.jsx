// @flow

// ----- Imports ----- //

import React from 'react';

import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { hiddenIf } from 'helpers/utilities';
import { type SetupPayPalRequestType } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { PayPalExpressButton } from 'components/paypalExpressButton/PayPalExpressButton';
import Button from 'components/button/button';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { PayPal } from 'helpers/paymentMethods';

// ----- Types ----- //

type PropTypes = {|
  paymentMethod: Option<PaymentMethod>,
  currencyId: IsoCurrency,
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
  // We have to show/hide PayPalExpressButton rather than conditionally rendering it
  // because we don't want to destroy and replace the iframe each time.
  // See PayPalExpressButton for more info.
  return (
    <div className="component-paypal-button-checkout__container">
      <div
        id="component-paypal-button-checkout"
        className={hiddenIf(props.paymentMethod !== PayPal, 'component-paypal-button-checkout')}
      >
        <PayPalExpressButton
          onPaymentAuthorisation={props.onPaymentAuthorised}
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
        modifierClasses={props.paymentMethod === PayPal ? ['hidden'] : []}
      >
        Continue to payment
      </Button>
    </div>
  );
}

export { SubscriptionSubmitButtons };
