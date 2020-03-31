// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { type Option } from 'helpers/types/option';

const Dot = () => <div css={styles.dot} />;

function EndSummary(props: {
  description?: string,
  promotion: Option<string>,
  price: string,
}) {
  return (
    <ul css={styles.list}>
      <li css={styles.listMain}><Dot />14-day free trial</li>
      <li css={styles.listMain}>
        <span><Dot />{props.promotion !== null ? props.promotion : `${props.price}/month`}</span>
        <span css={styles.subText}>
          {props.promotion !== null && props.description ?
            `So you'll pay ${props.description}` :
            'Your first payment will occur after the 14-day trial ends'}
        </span>
      </li>
      <li css={styles.listMain}>
        <span><Dot />Cancel at any time</span>
        <span css={styles.subText}>
          There is no set time on your agreement with us so you can end your subscription whenever you wish
        </span>
      </li>
    </ul>
  );
}

EndSummary.defaultProps = {
  description: '',
};

export default EndSummary;
