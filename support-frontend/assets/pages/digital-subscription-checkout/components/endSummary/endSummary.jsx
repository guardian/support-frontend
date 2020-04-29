// @flow

import React from 'react';
import * as styles from './endSummaryStyles';

const Dot = () => <div css={styles.dot} />;

function EndSummary(props: {
  priceString: string,
  savings: string,
}) {
  return (
    <ul css={styles.list}>
      <li>
        <Dot /><div css={styles.listMain}>14-day free trial</div>
        <span css={styles.subText}>
          Your first payment will occur after the trial ends
        </span>
      </li>
      <li>
        <Dot /><div css={styles.listMain}>{props.savings}</div>
        <span css={styles.subText}>{props.priceString}</span>
      </li>
      <li>
        <Dot /><div css={styles.listMain}>You can cancel any time</div>
      </li>
    </ul>
  );
}

export default EndSummary;
