// @flow

import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { border } from '@guardian/src-foundations/palette';
import EndSummary from 'pages/digital-subscription-checkout/components/endSummary/endSummary';

const endSummaryMobile = css`
  display: block;
  padding:${space[3]}px;
  border-top: 1px solid ${border.secondary};
  border-bottom: 1px solid ${border.secondary};

  ${from.desktop} {
    display: none;
  }
`;

function EndSummaryMobile() {
  return (
    <span css={endSummaryMobile}>
      <EndSummary />
    </span>
  );
}

export default EndSummaryMobile;
