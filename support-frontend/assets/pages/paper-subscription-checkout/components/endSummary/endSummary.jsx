// @flow

import React from 'react';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import mapStateToProps from './endSummarySelector';
import { textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { text, border, background } from '@guardian/src-foundations/palette';
import { type PaperFulfilmentOptions, Collection } from 'helpers/productPrice/fulfilmentOptions';

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

const listMain = css`
  ${textSans.medium({ fontWeight: 'bold' })};
  margin-left: ${space[3]}px;
  display: inline-block;
  max-width: 90%;
`;

const subText = css`
  display: block;
  ${textSans.small()};
  margin-left: ${space[5]}px;
  line-height: 135%;
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

type EndSummaryProps = {
  paymentStartDate: string,
  priceDescription: string,
  promotion: string | null,
  fulfilmentOption: PaperFulfilmentOptions,
}

function EndSummary({
  priceDescription, paymentStartDate, promotion, fulfilmentOption,
}: EndSummaryProps) {
  const subsCardPoint = (
    <li css={listItem}>
      <Dot /><div css={listMain}>Your first payment will be on <span css={bold}>{paymentStartDate}</span></div>
      <span css={subText}>Your subscription card will arrive in the post before the payment date</span>
    </li>
  );

  return (
    <ul css={list}>
      {promotion ? (
        <li css={listItem}>
          <Dot /><div css={listMain}>{promotion}</div>
          <span css={subText}>Then you&apos;ll pay {priceDescription}</span>
        </li>
      ) : (
        <li css={listItem}>
          <Dot /><div css={listMain}>You&apos;ll pay {priceDescription}</div>
        </li>
      )}
      {fulfilmentOption === Collection && subsCardPoint}
      <li css={listItem}>
        <Dot /><div css={listMain}>You can cancel any time</div>
      </li>
    </ul>
  );
}

export default connect(mapStateToProps)(EndSummary);
