// @flow

import React from 'react';
import { type ProductPrice } from 'helpers/productPrice/productPrices';
import { type DigitalBillingPeriod } from 'helpers/billingPeriods';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import EndSummary from 'pages/paper-subscription-checkout/components/endSummary/endSummary';
import * as styles from './orderSummaryStyles';
import { type Option } from 'helpers/types/option';

type PropTypes = {
  billingPeriod: DigitalBillingPeriod,
  // eslint-disable-next-line react/no-unused-prop-types
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  productPrice: ProductPrice,
  title: string,
  paymentStartDate?: Option<string>,
};

const OrderSummary = (props: PropTypes) => {

  const priceString =
    `You'll pay ${getPriceDescription(props.productPrice, props.billingPeriod)}`;

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
        </div>
      </div>
      <div css={styles.endSummary}>
        <EndSummary paymentStartDate={props.paymentStartDate || 'date to be confirmed'} />
      </div>
    </aside>
  );
};

OrderSummary.defaultProps = {
  changeSubscription: '',
  paymentStartDate: 'date to be confirmed',
};

export default OrderSummary;
