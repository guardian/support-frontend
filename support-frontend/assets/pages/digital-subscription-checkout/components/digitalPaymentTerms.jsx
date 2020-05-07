// @flow
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebitTerms';

export default function DigitalPaymentTerms(props: {
  paymentMethod: Option<PaymentMethod>,
}) {
  return props.paymentMethod === DirectDebit
    ? (
      <FormSection>
        <DirectDebitTerms />
      </FormSection>)
    : null;

}
