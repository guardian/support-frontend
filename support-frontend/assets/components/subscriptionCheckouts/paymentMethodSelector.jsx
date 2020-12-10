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
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ErrorMessage } from 'helpers/subscriptionsForms/validation';

type PropTypes = {|
  country: IsoCountry,
  paymentMethod: Option<PaymentMethod>,
  setPaymentMethod: Function,
  validationError: Option<ErrorMessage>,
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

  return (
    <Rows gap="large">
      <RadioGroup
        id="payment-methods"
        label="How would you like to pay?"
        hideLabel
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
    </Rows>);
}


export { PaymentMethodSelector };
