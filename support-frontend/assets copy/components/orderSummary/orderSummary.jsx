// @flow

import React, { type Node } from 'react';
import { SvgInfo } from '@guardian/src-icons';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import * as styles from './orderSummaryStyles';

type MobileOrderSummary = {
  title: Node,
  price: Node,
}

type PropTypes = {
  children: Node,
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  mobileSummary: MobileOrderSummary,
  total: Node,
};

function OrderSummary(props: PropTypes) {
  return (
    <aside css={styles.wrapper}>
      <div css={styles.topLine}>
        <div css={styles.topLineBorder}>
          <h3 css={styles.title}>Order summary</h3>
          {props.changeSubscription && <a href={props.changeSubscription}>Change</a>}
        </div>
      </div>
      <div css={styles.contentBlock}>
        <div css={styles.imageContainer}>{props.image}</div>
        <div css={styles.mobileSummary}>
          <h4>{props.mobileSummary.title}</h4>
          <p>{props.mobileSummary.price}</p>
        </div>
      </div>
      <div css={styles.products}>
        <div>
          {props.children}
        </div>
        <div css={styles.infoContainer}>
          <div css={styles.info}>
            <SvgInfo />
            <span>You can cancel any time</span>
          </div>
        </div>
        <div css={styles.total} aria-atomic="true" aria-live="polite">
          <span>Total:</span>
          <span>{props.total}</span>
        </div>
      </div>
    </aside>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
};

export default OrderSummary;
