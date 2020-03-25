// @flow

import React from 'react';
import { css } from '@emotion/core';
import { headline, body, textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { border, brandAltBackground, text } from '@guardian/src-foundations/palette';

import { type ProductPrice } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';

export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {
  billingPeriod: BillingPeriod,
  // eslint-disable-next-line react/no-unused-prop-types
  changeSubscription?: string | null,
  image: $Call<GridImageType, GridImg>,
  productPrice: ProductPrice,
  title: string,
};

const wrapper = css`
  padding: ${space[3]}px;
  color: ${text.primary};
  a, a:visited {
    display: none;
    @media (min-width: 660px) {
      display: block;
      ${textSans.medium()};
      color: ${text.primary};
    }
  }
`;

const topLine = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space[3]}px;

  a, a:visited {
    display: block;
    ${textSans.medium()};
    color: ${text.primary};
    @media (min-width: 660px) {
      display: none;
    }
  }
`;

const sansTitle = css`
  ${textSans.medium()};
  font-weight: bold;
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
    @media (min-width: 740px) and (max-width: 975px) {
      ${body.medium()};
      font-weight: bold;
    }
  }
  p, span {
    ${body.medium()};
    max-width: 220px;
    @media (min-width: 740px) and (max-width: 975px) {
      ${body.small()};
    }
  }
  span {
    background-color: ${brandAltBackground.primary};
    padding: 0 ${space[1]}px;
  }
`;

function OrderSummary(props: PropTypes) {
  const description = getPriceDescription(props.productPrice, props.billingPeriod, true);
  const ChangeLink = () => <a href={props.changeSubscription}>Change</a>;

  return (
    <div css={wrapper}>
      <div css={topLine}>
        <h2 css={sansTitle}>Order summary</h2>
        <ChangeLink />
      </div>
      <div css={contentBlock}>
        <div css={image}>{props.image}</div>
        <div css={textBlock}>
          <h3>{props.title}</h3>
          <p>{description}</p>
          <span>14 day free trial</span>
        </div>
      </div>
      <ChangeLink />
    </div>
  );
}

OrderSummary.defaultProps = {
  changeSubscription: '',
};

export default OrderSummary;
