// @flow

import React, { type Node } from 'react';
import { showPrice, applyPromotion, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { billingPeriodNoun } from 'helpers/billingPeriods';

import styles from './summary.module.scss';


type PropTypes = {
  children: Node,
  productPrice: Price,
  promotion: ?Promotion,
  billingPeriod: BillingPeriod,
};

const displayPriceForPeriod = (productPrice: Price, billingPeriod: BillingPeriod) =>
  `${showPrice(productPrice)}/${billingPeriodNoun(billingPeriod)}`;

const Summary = ({
  children, promotion, productPrice, billingPeriod,
}: PropTypes) => (
  <aside className={styles.root}>
    <div className={styles.title}>
      <h3 className={styles.titleTitle} title="your subscription is Sdp">Sixday paper</h3>
      <h4 className={styles.titleCopy}>Graun + Observer</h4>
    </div>
    <div className={styles.pricing}>
      {
  (promotion && promotion.discountedPrice) ?
    (
      <span>
        <del>{showPrice(productPrice)}</del>&nbsp;
        {displayPriceForPeriod(applyPromotion(productPrice, promotion), billingPeriod)}
      </span>) : displayPriceForPeriod(productPrice, billingPeriod)

}
    </div>
    <div className={styles.data}>
      Home delivery
    </div>
  </aside>
);

export default Summary;
