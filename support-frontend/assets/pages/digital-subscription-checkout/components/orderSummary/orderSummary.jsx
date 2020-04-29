// @flow

import React from 'react';
import { type ProductPrice } from 'helpers/productPrice/productPrices';
import { type DigitalBillingPeriod } from 'helpers/billingPeriods';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import { getAppliedPromoDescription, getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import EndSummary from '../endSummary/endSummary';
import { getBillingDescription, hasDiscountOrPromotion } from 'helpers/productPrice/priceDescriptionsDigital';

import * as styles from './orderSummaryStyles';

type PropTypes = {
  billingPeriod: DigitalBillingPeriod,
  // eslint-disable-next-line react/no-unused-prop-types
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  productPrice: ProductPrice,
  title: string,
};

const appliedPromoString = (props: PropTypes) =>
  getAppliedPromoDescription(props.billingPeriod, props.productPrice) ||
  'Save over 20% against monthly in the first year.';

function OrderSummary(props: PropTypes) {

  const savings = hasDiscountOrPromotion(props.productPrice)
    ? appliedPromoString(props)
    : getPriceDescription(props.productPrice, props.billingPeriod);

  const priceString = getBillingDescription(props.productPrice, props.billingPeriod);

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
          <p>{priceString}</p>
          <span>14 day free trial</span>
        </div>
      </div>
      <EndSummary
        savings={savings}
        priceString={priceString}
      />
    </aside>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
};

export default OrderSummary;
