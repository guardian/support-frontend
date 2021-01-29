// @flow
import React from 'react';
import { css } from '@emotion/core';
import { headline, textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { brand, neutral } from '@guardian/src-foundations/palette';

const title = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  background-color: ${neutral[97]};
  padding: ${space[2]}px;
  border-top: 1px solid ${neutral[60]};
`;

const list = css`
  padding-top: ${space[2]}px;
  padding-bottom: ${space[9]}px;
`;

const listItem = css`
  margin: 0 ${space[9]}px;

  &:not(:last-of-type) {
    margin-bottom: ${space[4]}px;
  }
`;

const listItemMain = css`
  ${textSans.medium({ fontWeight: 'bold' })};

  &::before {
    display: inline-block;
    content: '';
    width: ${space[3]}px;
    height: ${space[3]}px;
    margin-right: -${space[3]}px;
    border-radius: 50%;
    background-color: ${brand[400]};
    transform: translateX(-${space[6]}px);
  }
`;


type ProductInfoItem = {
  mainText: string,
  subText?: string
}

type OrderSummaryProductProps = {
  productName: string,
  productInfo: ProductInfoItem[]
}

function OrderSummaryProduct(props: OrderSummaryProductProps) {
  return (
    <div>
      <h4 css={title}>{props.productName}</h4>
      <ul css={list}>
        {props.productInfo.map(infoItem => (
          <li css={listItem}>
            <div css={listItemMain}>{infoItem.mainText}</div>
            <span>{infoItem.subText}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderSummaryProduct;
