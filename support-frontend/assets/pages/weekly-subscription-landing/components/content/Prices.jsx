// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { body, headline } from '@guardian/src-foundations/typography';
import { from } from '@guardian/src-foundations/mq';
import FlexContainer from 'components/containers/FlexContainer';
import ProductOption, { type Product } from 'components/product/ProductOption';

export type PropTypes = {|
  products: Product[],
|};

const pricesSection = css`
  padding: 0 ${space[3]}px ${space[12]}px;
`;

const priceBoxes = css`
  margin-top: ${space[6]}px;
  justify-content: flex-start;
  align-items: stretch;
  ${from.desktop} {
    margin-top: ${space[9]}px;
  }
`;

const productOverride = css`
  &:not(:first-of-type) {
    margin-top: ${space[4]}px;
  }
  ${from.tablet} {
    &:not(:first-of-type) {
      margin-top: 0;
    }
    &:not(:last-of-type) {
      margin-right: ${space[5]}px;
    }
  }
`;

const productOverrideWithLabel = css`
  &:not(:first-of-type) {
    margin-top: ${space[12]}px;
  }
  ${from.tablet} {
    &:not(:first-of-type) {
      margin-top: 0;
    }
    &:not(:last-of-type) {
      margin-right: ${space[5]}px;
    }
  }
`;

const pricesHeadline = css`
  ${headline.medium({ fontWeight: 'bold' })};
`;

const pricesSubHeadline = css`
  ${body.medium()}
  padding-bottom: ${space[2]}px;
`;

function Prices({ products }: PropTypes) {
  return (
    <section css={pricesSection} id="subscribe">
      <h2 css={pricesHeadline}>Subscribe to the Guardian Weekly today</h2>
      <h4 css={pricesSubHeadline}>Select a gift period</h4>
      <FlexContainer cssOverrides={priceBoxes}>
        {products.map(product => (
          <ProductOption
            cssOverrides={product.label ? productOverrideWithLabel : productOverride}
            title={product.title}
            price={product.price}
            priceCopy={product.priceCopy}
            buttonCopy={product.buttonCopy}
            href={product.href}
            onClick={product.onClick}
            label={product.label}
          />
        ))}
      </FlexContainer>
    </section>
  );
}

export default Prices;
