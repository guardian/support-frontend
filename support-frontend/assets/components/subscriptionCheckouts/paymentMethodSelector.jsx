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
import { type PaymentMethod } from 'helpers/forms/paymentMethods';
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

const paymentMethodIcons: { [PaymentMethod]: Node } = {
  Stripe: <SvgCreditCard />,
  PayPal: <SvgPayPal />,
  DirectDebit: <SvgDirectDebit />,
};

const paymentMethodIds: { [PaymentMethod]: string } = {
  Stripe: 'qa-credit-card',
  PayPal: 'qa-paypal',
  DirectDebit: 'qa-direct-debit',
};

const paymentMethodText: { [PaymentMethod]: string } = {
  Stripe: 'Credit/Debit card',
  PayPal: 'PayPal',
  DirectDebit: 'Direct debit',
};

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
        {availablePaymentMethods.map(method => (<RadioWithImage
          id={paymentMethodIds[method]}
          image={paymentMethodIcons[method]}
          label={paymentMethodText[method]}
          name="paymentMethod"
          checked={paymentMethod === method}
          onChange={() => setPaymentMethod(method)}
        />))}
      </RadioGroup>
    </Rows>);
}


export { PaymentMethodSelector };
