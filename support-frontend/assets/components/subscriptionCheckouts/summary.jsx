// @flow

import React, { type Node } from 'react';
import { hasPromotion, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import styles from './summary.module.scss';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import Rows from '../base/rows';

export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {
  image: $Call<GridImageType, GridImg>,
  children: Node,
  productPrice: Price,
  promotion: ?Promotion,
  billingPeriod: BillingPeriod,
  dataList: DataListItem[],
  title: string,
  description: ?string
};

const Summary = ({
  children, image, promotion, productPrice, billingPeriod, dataList, description, title,
}: PropTypes) => (
  <aside className={styles.root}>
    <div className={styles.img}>
      <h2 className={styles.header}>Order summary</h2>
      {image}
    </div>
    <div className={styles.content}>
      <Rows>
        <header>
          <h3 className={styles.title} title={`your subscription is ${title}`}>{title}</h3>
          {description &&
          <h4 className={styles.titleDescription}>{description}</h4>
        }
        </header>
        <div>
          <PriceLabel
            className={styles.pricing}
            productPrice={productPrice}
            promotion={promotion}
            billingPeriod={billingPeriod}
          />
          {promotion && hasPromotion(promotion) &&
            <div className={styles.promo}>
              <strong className={styles.promoTitle}>{promotion.description}</strong>
              {' '}({promotion.promoCode})
            </div>
          }
        </div>

        {dataList.length > 0 &&
          <dl className={styles.data}>
            {dataList.map(item => [
              <dt>{item.title}</dt>,
              <dd>{item.value}</dd>,
            ])}
          </dl>
        }
        {children &&
          <div className={styles.children}>{children}</div>
        }
      </Rows>
    </div>
  </aside>
);

Summary.defaultProps = {
  dataList: [],
  children: null,
};

export default Summary;
