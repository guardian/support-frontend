// @flow

import React from 'react';
import { css } from '@emotion/core';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';

const directDebitTerms = css`
  a, a:visited {
    color: #121212;
  }
  p {
    margin-top: 10px;
  }
`;

const DirectDebitTerms = ({ paymentMethod }: { paymentMethod: Option<PaymentMethod> }) =>
  (paymentMethod === DirectDebit) && (
    <div css={directDebitTerms}>
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

export default DirectDebitTerms;
