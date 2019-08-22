// @flow

// ----- Imports ----- //

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import React from 'react';

import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type SetupPayPalRequestType } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { PayPalExpressButton } from 'components/paypalExpressButton/PayPalExpressButton';
import { type FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';
import { ErrorSummary } from './submitFormErrorSummary';
import { type Option } from 'helpers/types/option';
import { PayPal } from 'helpers/paymentMethods';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { hiddenIf } from 'helpers/utilities';

import 'components/forms/customFields/error.scss';
import './subscriptionSubmitButton.scss';

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
  allErrors: FormError<FormField>[],
|};

// ----- Render ----- //


function PayPalSubmitButton(props: PropTypes) {
  // We have to show/hide PayPalExpressButton rather than conditionally rendering it
  // because we don't want to destroy and replace the iframe each time.
  // See PayPalExpressButton for more info.
  return (
    <div className="component-submit-button">
      <div className="component-submit-button--margin">
        <div
          id="component-paypal-button-checkout"
          className={hiddenIf(props.paymentMethod !== PayPal, 'component-paypal-button-checkout')}
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
      </div>
      {props.paymentMethod === PayPal && (
        <span>{props.allErrors.length > 0 && <ErrorSummary errors={props.allErrors} />}</span>
      )}
    </div>
  );
}

export { PayPalSubmitButton };
