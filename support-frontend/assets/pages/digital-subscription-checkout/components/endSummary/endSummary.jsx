// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { connect } from 'react-redux';
import mapStateToProps from './endSummarySelector';
import { getGiftOrderSummaryText } from '../helpers';

export type EndSummaryProps = {
  priceDescription: string,
  promotion: string,
  orderIsAGift?: boolean,
  digitalGiftBillingPeriod: 'Annual' | 'Quarterly',
  price: string,
}

const Dot = () => <div css={styles.dot} />;

function EndSummary({
  promotion, priceDescription, orderIsAGift = false, digitalGiftBillingPeriod, price,
}: EndSummaryProps) {
  const giftText = getGiftOrderSummaryText(digitalGiftBillingPeriod, price);
  return (
    <span>
      {orderIsAGift ? (
        <ul css={styles.list}>
          <li>
            <Dot /><div css={styles.listMain}>{giftText.period}</div>
            <span css={styles.subText}>{giftText.cost}</span>
          </li>
          <li>
            <Dot /><div css={styles.listMain}>Personalised gift message</div>
            <span css={styles.subText}>
            Your gift recipient will receive their gift on your chosen date which will include a personalised message
            </span>
          </li>
          <li>
            <Dot />
            <div css={styles.listMain}>
            Activating your gift subscription
            </div>
            <span css={styles.subText}>
            A gift redemption link with instructions will be emailed to you and the gift recipient
            </span>
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
