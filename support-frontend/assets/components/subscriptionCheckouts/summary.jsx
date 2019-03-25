// @flow

import React, { type Node } from 'react';
import { showPrice, hasPromotion, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { billingPeriodNoun } from 'helpers/billingPeriods';
import styles from './summary.module.scss';
import { PriceLabel } from 'components/priceLabel/priceLabel';

export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {
  children: Node,
  productPrice: Price,
  promotion: ?Promotion,
  billingPeriod: BillingPeriod,
  dataList: DataListItem[],
  title: string,
  description: ?string
};

const Summary = ({
  children, promotion, productPrice, billingPeriod, dataList, description, title,
}: PropTypes) => (
  <aside className={styles.root}>
    <div className={styles.title}>
      <h3 className={styles.titleTitle} title={`your subscription is ${title}`}>{title}</h3>
      {description &&
        <h4 className={styles.titleCopy}>{description}</h4>
      }
    </div>
    <div className={styles.pricing}>
      <PriceLabel productPrice={productPrice} promotion={promotion} billingPeriod={billingPeriod} />
    </div>
    {promotion && hasPromotion(promotion) &&
      <div className={styles.promo}>
        <div className={styles.promoTitle}>{promotion.name} ({promotion.promoCode})</div>
        {promotion.description}
      </div>
    }
    {dataList.length > 0 &&
      <dl className={styles.data}>
        {dataList.map(item => [
          <dt>{item.title}</dt>,
          <dd>{item.value}</dd>,
        ])}
      </dl>
    }
    {children}
  </aside>
);

Summary.defaultProps = {
  dataList: [],
  children: null,
};

export default Summary;
