// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { connect } from 'react-redux';
import mapStateToProps, { type EndSummaryProps } from './endSummarySelector';

const Dot = () => <div css={styles.dot} />;

function EndSummary({ promotion, priceDescription }: EndSummaryProps) {
  return (
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
    </ul>
  );
}

export default connect(mapStateToProps)(EndSummary);
