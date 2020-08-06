// @flow

import React from 'react';
import { type ProductPrice } from 'helpers/productPrice/productPrices';
import { type DigitalBillingPeriod } from 'helpers/billingPeriods';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import { type SubscriptionProduct, DigitalPack } from 'helpers/subscriptions';
import EndSummaryDigital from 'components/subscriptionCheckouts/endSummary/endSummaryDigital';
import EndSummaryPrint from 'components/subscriptionCheckouts/endSummary/endSummaryPrint';
import * as styles from './orderSummaryStyles';

type PropTypes = {
  productType: SubscriptionProduct,
  billingPeriod: DigitalBillingPeriod,
  // eslint-disable-next-line react/no-unused-prop-types
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  productPrice: ProductPrice,
  title: string,
};

function OrderSummary(props: PropTypes) {

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
          {props.productType === DigitalPack && <span>14 day free trial</span>}
        </div>
      </div>
      <div css={styles.endSummary}>
        {props.productType === DigitalPack ? <EndSummaryDigital /> : <EndSummaryPrint paymentStartDate={null} />}
      </div>
    </aside>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
};

export default OrderSummary;
