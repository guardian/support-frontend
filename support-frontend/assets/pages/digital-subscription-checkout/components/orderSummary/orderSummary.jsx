// @flow

import React from 'react';
import { type ProductPrice } from 'helpers/productPrice/productPrices';
import { type DigitalBillingPeriod } from 'helpers/billingPeriods';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import EndSummary from 'pages/digital-subscription-checkout/components/endSummary/endSummary';
import * as styles from './orderSummaryStyles';
import { giftPeriod } from '../helpers';

type PropTypes = {
  billingPeriod: DigitalBillingPeriod,
  // eslint-disable-next-line react/no-unused-prop-types
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  productPrice: ProductPrice,
  title: string,
  orderIsAGift?: boolean,
};

function OrderSummary(props: PropTypes) {
  const digitalBillingPeriod = props.billingPeriod === 'Annual' ? props.billingPeriod : 'Monthly';
  const priceString = props.orderIsAGift ? giftPeriod[digitalBillingPeriod].cost :
    getBillingDescription(props.productPrice, props.billingPeriod);

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
          {!props.orderIsAGift && <span>14 day free trial</span>}
        </div>
      </div>
      <div css={styles.endSummary}>
        <EndSummary orderIsAGift={props.orderIsAGift} />
      </div>
    </aside>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
  orderIsAGift: false,
};

export default OrderSummary;
