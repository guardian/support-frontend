// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { type Option } from 'helpers/types/option';

const Dot = () => <div css={styles.dot} />;

function EndSummary(props: {
  priceString: string,
  savings: Option<string>,
}) {
  return (
    <ul css={styles.list}>
      <li css={styles.listMain}>
        <span><Dot />14-day free trial</span>
        <span css={styles.subText}>
          Your first payment will occur after the trial ends
        </span>
      </li>
      <li css={styles.listMain}>
        <span><Dot />{props.savings}</span>
        <span css={styles.subText}>{props.priceString}</span>
      </li>
      <li css={styles.listMain}>
        <span><Dot />You can cancel any time</span>
      </li>
    </ul>
  );
}

export default EndSummary;
