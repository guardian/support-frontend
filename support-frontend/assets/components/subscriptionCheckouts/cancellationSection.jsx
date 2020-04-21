// @flow
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import styles from './summary.module.scss';
import EndSummary from 'components/subscriptionCheckouts/endSummary/endSummary';
import CancellationPolicy from 'components/subscriptionCheckouts/cancellationPolicy';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebitTerms';

export default function CancellationSection(props: {
  paymentMethod: Option<PaymentMethod>,
  orderIsAGift?: boolean,
  isDigitialCheckout?: boolean,
}) {
  const cancellationPolicyDisplayStyle = props.isDigitialCheckout ? styles.cancellationPolicy : null;

  return (
    <FormSection>
      <div className={cancellationPolicyDisplayStyle}>
        <CancellationPolicy orderIsAGift={props.orderIsAGift} />
      </div>
      {props.isDigitialCheckout && (
        <div className={styles.endSummay}>
          <EndSummary />
        </div>
      )}
      <DirectDebitTerms paymentMethod={props.paymentMethod} />
    </FormSection>
  );
}

CancellationSection.defaultProps = {
  orderIsAGift: false,
  isDigitialCheckout: false,
};
