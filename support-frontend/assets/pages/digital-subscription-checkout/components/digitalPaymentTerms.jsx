// @flow
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { border } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';

import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebitTerms';

const directDebitSection = css`
  padding: 0 ${space[3]}px ${space[3]}px;
  background-color: #F6F6F6;
  border: none;

  ${from.desktop} {
    border-top: 1px solid ${border.secondary};
  }
`;

const borderTop = css`
  width: 100%;
  border-top: 1px solid ${border.secondary};

  ${from.desktop} {
    border-top: none;
  }
`;

export default function DigitalPaymentTerms(props: {
  paymentMethod: Option<PaymentMethod>,
}) {
  return props.paymentMethod === DirectDebit
    ? (
      <div css={directDebitSection}>
        <div css={borderTop}>
          <DirectDebitTerms />
        </div>
      </div>)
    : null;

}
