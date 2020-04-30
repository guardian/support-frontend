// @flow
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebitTerms';
import CancellationPolicy from 'components/subscriptionCheckouts/cancellationPolicy';

export default function PaymentTerms(props: {
  paymentMethod: Option<PaymentMethod>,
}) {
  return (
    <FormSection>
      <CancellationPolicy />
      {(props.paymentMethod === DirectDebit) && <DirectDebitTerms />}
    </FormSection>
  );
}
