// @flow

import React from 'react';
import { css } from '@emotion/core';
import { headline, body, textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { border, brandAltBackground } from '@guardian/src-foundations/palette';

import { type ProductPrice } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';

export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {
  billingPeriod: BillingPeriod,
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  productPrice: ProductPrice,
  title: string,
  // eslint-disable-next-line react/no-unused-prop-types
  product: SubscriptionProduct,
};

const wrapper = css`
  padding: ${space[3]}px;
`;

const topLine = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space[3]}px;
`;

const sansTitle = css`
  ${textSans.medium()};
  font-weight: bold;
`;

const link = css`
  ${textSans.medium()};
  display: block;
`;

const contentBlock = css`
  display: block;
  width: 100%;
  margin-bottom: ${space[3]}px;
`;

const image = css`
  display: inline-flex;
  width: 73px;
  height: 65px;
  padding-top: 8px;
  background-color: ${border.primary};
  overflow: hidden;
  position: absolute;
  img {
    width: 160%;
    align-items: flex-end;
  }
`;

const textBlock = css`
  margin-left: 82px;
  h3 {
    ${headline.xxsmall()};
    font-weight: bold;
  }
  p {
    ${body.medium()};
  }
  span {
    background-color: ${brandAltBackground.primary};
    padding: 0 ${space[1]}px;
  }
`;


function OrderSummary(props: PropTypes) {
  const description = getPriceDescription(props.productPrice, props.billingPeriod, true);

  return (
    <div css={wrapper}>
      <div css={topLine}>
        <h2 css={sansTitle}>Order summary</h2>
        <a css={link} href={props.changeSubscription}>Change</a>
      </div>
      <div css={contentBlock}>
        <div css={image}>{props.image}</div>
        <div css={textBlock}>
          <h3>{props.title}</h3>
          <p>{description}</p>
          <span>14 day free trial</span>
        </div>
      </div>

    </div>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
};

export default OrderSummary;
