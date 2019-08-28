// @flow

import React from 'react';

import { compose } from 'redux';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';
import { Stripe, type PaymentMethod } from 'helpers/paymentMethods';
import { type Option } from 'helpers/types/option';
import { SubscriptionSubmitButton } from 'components/subscriptionCheckouts/subscriptionSubmitButton';
import './creditCardForm.scss';

const InputWithLabel = withLabel(Input);
const InputWithError = compose(asControlled, withError)(InputWithLabel);

export type PropTypes = {
    paymentMethod: Option<PaymentMethod>,
    creditCardNumber: number | null,
    setCreditCardNumber: Function,
    expiryDate: string | null,
    setExpiryDate: Function,
    cvc: number | null,
    setCvc: Function,
    formErrors: FormError<FormField>[],
    allErrors: Array<Object>,
    priceSummary: string,
}

export default function CreditCardForm(props: PropTypes) {
  return (
    <div>
      <InputWithError
        id="credit-card-number"
        label="Card number"
        type="text"
        value={props.creditCardNumber}
        setValue={props.setCreditCardNumber}
        error={firstError('creditCardNumber', props.formErrors)}
      />
      <div className="component-credit-card-inputs">
        <InputWithError
          id="expiry-date"
          label="Expiry date"
          type="text"
          value={props.expiryDate}
          setValue={props.setExpiryDate}
          error={firstError('expiryDate', props.formErrors)}
          className="component-input-short"
        />
        <InputWithError
          id="cvc"
          label="CVC"
          type="text"
          value={props.cvc}
          setValue={props.setCvc}
          error={firstError('cvc', props.formErrors)}
          className="component-input-short"
        />
      </div>
      <SubscriptionSubmitButton
        paymentMethod={props.paymentMethod}
        allErrors={props.allErrors}
        className={Stripe}
      />
      <p className="component-credit-card-price">{props.priceSummary}.</p>
    </div>
  );
}
