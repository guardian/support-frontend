// @flow

import React from 'react';
import * as styles from './endSummaryStyles';

const Dot = () => <div css={styles.dot} />;

function EndSummary(props: {description: string}) {
  return (
    <ul css={styles.list}>
      <li css={styles.listMain}><Dot />14-day free trial</li>
      <li css={styles.listMain}>
        <span><Dot />First 3 months half price</span>
        <span css={styles.subText}>So you&apos;ll pay {props.description}</span>
      </li>
      <li css={styles.listMain}>
        <span><Dot />Cancel at any point</span>
        <span css={styles.subText}>
          There is no set time on your agreement with us so you can end your subscription whenever you wish
        </span>
      </li>
    </ul>
  );
}

export default EndSummary;
