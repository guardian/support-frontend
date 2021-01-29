// @flow

import React, { type Node } from 'react';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import * as styles from './orderSummaryStyles';

type PropTypes = {
  children: Node,
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
};

function OrderSummary(props: PropTypes) {
  return (
    <aside css={styles.wrapper}>
      <div css={styles.topLine}>
        <h3 css={styles.title}>Order summary</h3>
        <a href={props.changeSubscription}>Change</a>
      </div>
      <div css={styles.contentBlock}>
        <div css={styles.imageContainer}>{props.image}</div>
      </div>
      <div css={styles.products}>
        {props.children}
        <div>You can cancel any time</div>
      </div>
    </aside>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
};

export default OrderSummary;
