// @flow
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import styles from './summary.module.scss';
import EndSummary from 'components/subscriptionCheckouts/endSummary/endSummary';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebitTerms';

export default function digitalCancellationSection(props: {
  paymentMethod: Option<PaymentMethod>,
}) {
  return (
    <FormSection>
      <div className={styles.endSummay}>
        <EndSummary />
      </div>
      {(props.paymentMethod === DirectDebit) && <DirectDebitTerms />}
    </FormSection>
  );
}
