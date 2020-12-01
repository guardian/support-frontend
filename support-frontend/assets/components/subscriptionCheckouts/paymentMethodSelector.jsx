// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { RadioGroup, Radio } from '@guardian/src-radio';
import {
  SvgCreditCard,
  SvgDirectDebit,
  SvgPayPal,
} from '@guardian/src-icons';

import Rows from 'components/base/rows';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import { type BillingPeriod } from 'helpers/billingPeriods';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ErrorMessage } from 'helpers/subscriptionsForms/validation';

type PropTypes = {|
  country: IsoCountry,
  paymentMethod: Option<PaymentMethod>,
  onPaymentAuthorised: Function,
  setPaymentMethod: Function,
  validationError: Option<ErrorMessage>,
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

type RadioWithImagePropTypes = {
  inputId: string,
  image: Node,
  label: string,
  name: string,
  checked: boolean,
  onChange: Function,
}

const radioWithImageStyles = css`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
`;

const paymentIcon = css`
  min-width: 30px;
  max-width: 40px;
`;

const RadioWithImage = (props: RadioWithImagePropTypes) => (
  <div css={radioWithImageStyles}>
    <Radio {...props} />
    <div css={paymentIcon}>{props.image}</div>
  </div>
);

function PaymentMethodSelector(props: PropTypes) {
  const paymentMethods = supportedPaymentMethods(props.country);

  return (paymentMethods.length > 1 ?
    <FormSection title="How would you like to pay?">
      <Rows gap="large">
        <div>
          <RadioGroup
            id="payment-methods"
            legend="How would you like to pay?"
            error={props.validationError}
            role="radiogroup"
          >
            {paymentMethods.includes(DirectDebit) &&
            <RadioWithImage
              inputId="qa-direct-debit"
              image={<SvgDirectDebit />}
              label="Direct debit"
              name="paymentMethod"
              checked={props.paymentMethod === DirectDebit}
              onChange={() => props.setPaymentMethod(DirectDebit)}
            />}
            <RadioWithImage
              inputId="qa-credit-card"
              image={<SvgCreditCard />}
              label="Credit/Debit card"
              name="paymentMethod"
              checked={props.paymentMethod === Stripe}
              onChange={() => props.setPaymentMethod(Stripe)}
            />
            <RadioWithImage
              inputId="qa-paypal"
              image={<SvgPayPal />}
              label="PayPal"
              name="paymentMethod"
              checked={props.paymentMethod === PayPal}
              onChange={() => props.setPaymentMethod(PayPal)}
            />
          </RadioGroup>
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
