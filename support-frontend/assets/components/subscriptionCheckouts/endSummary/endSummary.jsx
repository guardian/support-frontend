// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { connect } from 'react-redux';
import mapStateToProps from 'components/subscriptionCheckouts/endSummary/endSummarySelector';

import type { EndSummaryProps } from 'components/subscriptionCheckouts/endSummary/endSummarySelector';

const has = item => item !== null;

const Dot = () => <div css={styles.dot} />;

const CancellationPolicy = () => (
  <>
    <Dot /><span>Cancel anytime</span>
    <span css={styles.subText}>
      End your subscription whenever you wish
    </span>
  </>
);

const Promotion = ({ priceDescription, promotion, displayPrice }: EndSummaryProps) => (
  <>
    <span><Dot />{has(promotion) ? promotion : `${displayPrice}/month`}</span>
    <span css={styles.subText} >
      {has(promotion) && priceDescription ?
      `So you'll pay ${priceDescription}` :
      'Your first payment will occur after the 14-day trial ends'}
    </span>
  </>
);

const FreeTrial = () => (<><Dot />14-day free trial</>);

function EndSummary({ priceDescription, promotion, displayPrice }: EndSummaryProps) {

  return (
    <ul css={styles.list}>
      <li css={styles.listMain}>
        <FreeTrial />
      </li>
      <li css={styles.listMain}>
        <Promotion
          priceDescription={priceDescription}
          promotion={promotion}
          displayPrice={displayPrice}
        />
      </li>
      <li css={styles.listMain}>
        <CancellationPolicy />
      </li>
    </ul>
  );
}

export default connect(mapStateToProps)(EndSummary);
