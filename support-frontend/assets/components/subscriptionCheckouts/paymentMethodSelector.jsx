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
import { DirectDebit, PayPal, Stripe, type PaymentMethod } from 'helpers/forms/paymentMethods';
import type { ErrorMessage } from 'helpers/subscriptionsForms/validation';

type PropTypes = {|
  availablePaymentMethods: PaymentMethod[],
  paymentMethod: Option<PaymentMethod>,
  setPaymentMethod: Function,
  validationError: Option<ErrorMessage>,
|}

type RadioWithImagePropTypes = {
  id: string,
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

function PaymentMethodSelector({
  availablePaymentMethods, paymentMethod, setPaymentMethod, validationError,
}: PropTypes) {
  return (
    <Rows gap="large">
      <RadioGroup
        id="payment-methods"
        label="How would you like to pay?"
        hideLabel
        error={validationError}
        role="radiogroup"
      >
        {availablePaymentMethods.includes(DirectDebit) &&
          <RadioWithImage
            id="qa-direct-debit"
            image={<SvgDirectDebit />}
            label="Direct debit"
            name="paymentMethod"
            checked={paymentMethod === DirectDebit}
            onChange={() => setPaymentMethod(DirectDebit)}
          />}
        <RadioWithImage
          id="qa-credit-card"
          image={<SvgCreditCard />}
          label="Credit/Debit card"
          name="paymentMethod"
          checked={paymentMethod === Stripe}
          onChange={() => setPaymentMethod(Stripe)}
        />
        <RadioWithImage
          id="qa-paypal"
          image={<SvgPayPal />}
          label="PayPal"
          name="paymentMethod"
          checked={paymentMethod === PayPal}
          onChange={() => setPaymentMethod(PayPal)}
        />
      </RadioGroup>
    </Rows>);
}


export { PaymentMethodSelector };
