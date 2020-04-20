// @flow
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import Text from 'components/text/text';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';

import styles from './summary.module.scss';
import EndSummary from 'components/subscriptionCheckouts/endSummary/endSummary';
import { cancellationCopy } from 'components/subscriptionCheckouts/endSummary/endSummaryCopy';

const CancellationPolicy = ({ orderIsAGift }: {orderIsAGift?: boolean}) => (
  <Text>
    {!orderIsAGift && (
      <p>
        <strong>{cancellationCopy.title}</strong> {cancellationCopy.body}
      </p>
      )}
  </Text>
);

CancellationPolicy.defaultProps = {
  orderIsAGift: false,
};

const DirectDebitTerms = ({ paymentMethod }: { paymentMethod: Option<PaymentMethod> }) =>
  (paymentMethod === DirectDebit) && (
    <div className={styles.directDebitTerms}>
      <p>
        <strong>Payments by GoCardless</strong> read the <a href="https://gocardless.com/privacy">GoCardless privacy notice</a>
      </p>
      <p>
        <strong>Advance notice</strong> The details of your Direct Debit instruction including
        payment schedule, due date, frequency and amount will be sent to you within three working
        days. All the normal Direct Debit safeguards and guarantees apply.
      </p>
      <p>
        <strong>Direct Debit</strong><br />
        The Guardian, Unit 16, Coalfield Way, Ashby Park, Ashby-De-La-Zouch, LE65 1TJ United
        Kingdom<br />
        Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays, 8am-6pm at weekends
        (GMT/BST) <a className="component-customer-service__email" href="mailto:contribution.support@theguardian.com">contribution.support@theguardian.com</a>
      </p>
    </div>
  );

export default function CancellationSection(props: {
  paymentMethod: Option<PaymentMethod>,
  orderIsAGift?: boolean,
}) {
  return (
    <FormSection>
      <div className={styles.cancellationPolicy}>
        <CancellationPolicy orderIsAGift={props.orderIsAGift} />
      </div>
      <div className={styles.endSummay}>
        <EndSummary />
      </div>
      <DirectDebitTerms paymentMethod={props.paymentMethod} />
    </FormSection>
  );
}

CancellationSection.defaultProps = {
  orderIsAGift: false,
};
