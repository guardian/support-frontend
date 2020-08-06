// @flow

import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { border, background } from '@guardian/src-foundations/palette';
import EndSummaryDigital from 'components/subscriptionCheckouts/endSummary/endSummaryDigital';
import EndSummaryPrint from 'components/subscriptionCheckouts/endSummary/endSummaryPrint';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import { DigitalPack } from 'helpers/subscriptions';

const endSummaryMobile = css`
  display: block;
  padding: ${space[3]}px;
  border-top: 1px solid ${border.secondary};
  background-color: #f6f6f6; /* Using the hex code as ${background.secondary} isn't exposed in the API yet */

  li:last-of-type {
    margin-bottom: 0;
  }

  ${from.desktop} {
    display: none;
  }
`;

type EndSummaryMobileProps = {
  product: SubscriptionProduct,
}

function EndSummaryMobile({ product }: EndSummaryMobileProps) {
  return (
    <span css={endSummaryMobile}>

      {
        // $FlowFixMe
        product === DigitalPack ? <EndSummaryDigital /> : <EndSummaryPrint paymentStartDate={null} />
      }
    </span>
  );
}

export default EndSummaryMobile;
