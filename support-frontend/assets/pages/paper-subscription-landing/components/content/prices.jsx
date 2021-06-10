// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';
import { from, between } from '@guardian/src-foundations/mq';
import { SvgInfo } from '@guardian/src-icons';

import ProductInfoChip from 'components/product/productInfoChip';
import FlexContainer from 'components/containers/flexContainer';
import ProductOption, { type Product } from 'components/product/productOption';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';

import LinkTo from './linkTo';
import { setTab } from '../../paperSubscriptionLandingPageActions';
import { type ActiveTabState } from '../../paperSubscriptionLandingPageReducer';

export type PropTypes = {|
  activeTab: ActiveTabState,
  setTabAction: typeof setTab,
  products: Product[],
|};

const pricesSection = css`
  padding: 0 ${space[3]}px ${space[12]}px;
`;

const priceBoxes = css`
  margin-top: ${space[6]}px;
  justify-content: flex-start;
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
      margin-right: ${space[4]}px;
    }
  }
  ${between.tablet.and.desktop} {
    padding: ${space[3]}px ${space[2]}px;
  }
  ${from.desktop} {
    &:not(:last-of-type) {
      margin-right: ${space[5]}px;
    }
  }
`;

const productOverrideWithLabel = css`
  ${productOverride}
  &:not(:first-of-type) {
    margin-top: ${space[12]}px;
  }
  ${from.tablet} {
    &:not(:first-of-type) {
      margin-top: 0;
    }
  }
`;

const pricesHeadline = css`
  ${headline.medium({ fontWeight: 'bold' })};
`;

const pricesInfo = css`
  margin-top: ${space[6]}px;
`;

function Prices({
  activeTab, setTabAction, products,
}: PropTypes) {
  const infoText = `${activeTab === HomeDelivery ? 'Delivery is included. ' : ''}You can cancel your subscription at any time`;
  return (
    <section css={pricesSection} id="subscribe">
      <h2 css={pricesHeadline}>Pick your subscription package below</h2>
      <FlexContainer cssOverrides={priceBoxes}>
        {products.map(product => (
          <ProductOption
            cssOverrides={product.label ? productOverrideWithLabel : productOverride}
            title={product.title}
            price={product.price}
            priceCopy={product.priceCopy}
            offerCopy={product.offerCopy}
            buttonCopy={product.buttonCopy}
            href={product.href}
            onClick={product.onClick}
            onView={product.onView}
            label={product.label}
          />
        ))}
      </FlexContainer>
      <div css={pricesInfo}>
        {
            activeTab === Collection ?
              <LinkTo tab={HomeDelivery} setTabAction={setTabAction}>Switch to Delivery</LinkTo> :
              <LinkTo tab={Collection} setTabAction={setTabAction}>
                  Switch to Subscription card
              </LinkTo>
          }
      </div>
      <div css={pricesInfo}>
        <ProductInfoChip icon={<SvgInfo />}>
          {infoText}
        </ProductInfoChip>
      </div>
    </section>
  );
}

export default Prices;
