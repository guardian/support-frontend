// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { body, headline } from '@guardian/src-foundations/typography';
import FlexContainer from 'components/containers/FlexContainer';
import ProductOption, { type Product } from 'components/product/ProductOption';

export type PropTypes = {|
  products: Product[],
|};

const pricesSection = css`
  padding-bottom: ${space[12]}px;
`;

const priceBoxes = css`
  margin-top: ${space[9]}px;
  justify-content: flex-start;
  align-items: stretch;
`;

const productOverride = css`
  &:not(:last-of-type) {
    margin-right: ${space[5]}px;
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
            cssOverrides={productOverride}
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
