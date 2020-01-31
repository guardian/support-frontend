// @flow

import React from 'react';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import Rows from 'components/base/rows';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import SvgDirectDebitSymbol from 'components/svgs/directDebitSymbol';
import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { withError } from 'hocs/withError';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import { type BillingPeriod } from 'helpers/billingPeriods';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

type PropTypes = {|
  country: IsoCountry,
  paymentMethod: Option<PaymentMethod>,
  onPaymentAuthorised: Function,
  setPaymentMethod: Function,
  validationError: Option<string>,
  allErrors: Array<Object>,
  billingPeriod: BillingPeriod,
  amount: number,
  setupRecurringPayPalPayment: Function,
  isTestUser: boolean,
  validateForm: Function,
  csrf: Csrf,
  currencyId: IsoCurrency,
  formIsValid: Function,
  payPalHasLoaded: boolean,
|}

const FieldsetWithError = withError(Fieldset);

function PaymentMethodSelector(props: PropTypes) {
  const paymentMethods = supportedPaymentMethods(props.country);

  return (paymentMethods.length > 1 ?
    <FormSection title="How would you like to pay?">
      <Rows gap="large">
        <div>
          <FieldsetWithError
            id="payment-methods"
            legend="How would you like to pay?"
            error={props.validationError}
            role="radiogroup"
          >
            {paymentMethods.includes(DirectDebit) &&
            <RadioInput
              inputId="qa-direct-debit"
              image={<SvgDirectDebitSymbol />}
              text="Direct debit"
              name="paymentMethod"
              checked={props.paymentMethod === DirectDebit}
              onChange={() => props.setPaymentMethod(DirectDebit)}
            />}
            <RadioInput
              inputId="qa-credit-card"
              image={<SvgNewCreditCard />}
              text="Credit/Debit card"
              name="paymentMethod"
              checked={props.paymentMethod === Stripe}
              onChange={() => props.setPaymentMethod(Stripe)}
            />
            <RadioInput
              inputId="qa-paypal"
              image={<SvgPayPal />}
              text="PayPal"
              name="paymentMethod"
              checked={props.paymentMethod === PayPal}
              onChange={() => props.setPaymentMethod(PayPal)}
            />
          </FieldsetWithError>
        </div>
      </Rows>
      {props.paymentMethod === PayPal && (
      <PayPalSubmitButton
        paymentMethod={props.paymentMethod}
        onPaymentAuthorised={props.onPaymentAuthorised}
        csrf={props.csrf}
        currencyId={props.currencyId}
        payPalHasLoaded={props.payPalHasLoaded}
        formIsValid={props.formIsValid}
        validateForm={props.validateForm}
        isTestUser={props.isTestUser}
        setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
        amount={props.amount}
        billingPeriod={props.billingPeriod}
        allErrors={props.allErrors}
      />)}
    </FormSection>
    : null);
}


export { PaymentMethodSelector };
