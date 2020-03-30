// @flow

import React from 'react';
import { type ProductPrice } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import EndSummary from 'components/subscriptionCheckouts/endSummary/endSummary';

import * as styles from './orderSummaryStyles';

type PropTypes = {
  billingPeriod: BillingPeriod,
  // eslint-disable-next-line react/no-unused-prop-types
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  productPrice: ProductPrice,
  title: string,
};


function OrderSummary(props: PropTypes) {
  const description = getPriceDescription(props.productPrice, props.billingPeriod, true);

  return (
    <aside css={styles.wrapper}>
      <div css={styles.topLine}>
        <h2 css={styles.sansTitle}>Order summary</h2>
        <a href={props.changeSubscription}>Change</a>
      </div>
      <div css={styles.contentBlock}>
        <div css={styles.imageContainer}>{props.image}</div>
        <div css={styles.textBlock}>
          <h3>{props.title}</h3>
          <p>{description}</p>
          <span>14 day free trial</span>
        </div>
      </div>
      <EndSummary description={description} />
    </aside>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
};

export default OrderSummary;
