// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { connect } from 'react-redux';
import mapStateToProps from './endSummarySelector';

export type EndSummaryProps = {
  priceDescription: string,
  promotion: string,
  orderIsAGift?: boolean,
  giftType: {
    period: string,
    cost: string,
  } | null,
}

const Dot = () => <div css={styles.dot} />;

function EndSummary({
  promotion, priceDescription, orderIsAGift, giftType,
}: EndSummaryProps) {
  return (
    <span>
      {orderIsAGift ? (
        <ul css={styles.list}>
          <li>
            <Dot /><div css={styles.listMain}>{giftType && giftType.period}</div>
            <span css={styles.subText}>{giftType && giftType.cost}</span>
          </li>
          <li>
            <Dot /><div css={styles.listMain}>We&apos;ll email your gift to the recipient on the date your choose</div>
            <span css={styles.subText}>
              The gift subscription will start when the recipient redeems the gift.
            </span>
          </li>
          <li>
            <Dot />
            <div css={styles.listMain}>
              You can send a personal message to the recipient that we&apos;ll send with your gift
            </div>
          </li>
        </ul>) :
      (
        <ul css={styles.list}>
          <li>
            <Dot /><div css={styles.listMain}>{promotion}</div>
            <span css={styles.subText}>{priceDescription}</span>
          </li>
          <li>
            <Dot /><div css={styles.listMain}>14-day free trial</div>
            <span css={styles.subText}>
            Your first payment will occur after the trial ends
            </span>
          </li>
          <li>
            <Dot /><div css={styles.listMain}>You can cancel any time</div>
          </li>
        </ul>)
      }
    </span>
  );
}

EndSummary.defaultProps = {
  orderIsAGift: false,
};

export default connect(mapStateToProps)(EndSummary);
