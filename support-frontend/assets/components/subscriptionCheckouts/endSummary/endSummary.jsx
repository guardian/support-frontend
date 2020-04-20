// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { type Option } from 'helpers/types/option';
import { connect } from 'react-redux';
import { cancellationCopy } from 'components/subscriptionCheckouts/endSummary/endSummaryCopy';
import mapStateToProps from 'components/subscriptionCheckouts/endSummary/endSummarySelector';

const Dot = () => <div css={styles.dot} />;

type Props = {
  description: string,
  promotion: Option<string>,
  formattedPrice: string,
};

function EndSummary({ description, promotion, formattedPrice }: Props) {

  return (
    <ul css={styles.list}>
      <li css={styles.listMain}><Dot />14-day free trial</li>
      <li css={styles.listMain}>
        <span><Dot />{promotion !== null ? promotion : `${formattedPrice}/month`}</span>
        <span css={styles.subText}>
          {promotion !== null && description ?
            `So you'll pay ${description}` :
            'Your first payment will occur after the 14-day trial ends'}
        </span>
      </li>
      <li css={styles.listMain}>
        <span><Dot />{cancellationCopy.title}</span>
        <span css={styles.subText}>
          {cancellationCopy.body}
        </span>
      </li>
    </ul>
  );
}

export default connect(mapStateToProps)(EndSummary);
