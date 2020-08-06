// @flow

import React from 'react';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import mapStateToProps from './endSummarySelector';
import { textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { text, border, background } from '@guardian/src-foundations/palette';

const list = css`
  ${from.desktop} {
    color: ${text.primary};
    width: calc(100%-${space[3]}px * 2);
    margin: ${space[3]}px;
    padding-top: ${space[3]}px;
    border-top: 1px solid ${border.secondary};
  }
`;

const listItem = css`
  margin-bottom: ${space[4]}px;
`;

const listFirst = css`
  ${textSans.medium()};
`;

const listMain = css`
  ${textSans.medium()};
  margin-left: ${space[3]}px;
  display: inline-block;
  max-width: 90%;
`;

const bold = css`
  font-weight: bold;
`;

const dot = css`
  display: inline-block;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  background-color: ${background.ctaPrimary};
  vertical-align: top;
  margin-top: ${space[2]}px;
`;

const Dot = () => <div css={dot} />;

type EndSummaryPrintProps = {
  paymentStartDate: Date | null,
}

function EndSummaryPrint({ paymentStartDate }: EndSummaryPrintProps) {
  return (
    <ul css={list}>
      <li css={listItem}>
        <div css={listFirst}>Your first payment will be on <span css={bold}>{paymentStartDate}</span></div>
      </li>
      <li css={listItem}>
        <Dot /><div css={listMain}>Your subscription card will arrive in the post before the payment date</div>
      </li>
      <li css={listItem}>
        <Dot />
        <div css={listMain}>
          In case you receive your card earlier, no payment with be charged before this date
        </div>
      </li>
      <li css={listItem}>
        <Dot /><div css={listMain}>You can cancel any time</div>
      </li>
    </ul>
  );
}

export default connect(mapStateToProps)(EndSummaryPrint);
