import React from "react";
import { css } from "@emotion/core";
import { space } from "@guardian/src-foundations";
import { headline } from "@guardian/src-foundations/typography";
import { brand } from "@guardian/src-foundations/palette";
import { from, between } from "@guardian/src-foundations/mq";
import { SvgInfo } from "@guardian/src-icons";
import ProductInfoChip from "components/product/productInfoChip";
import FlexContainer from "components/containers/flexContainer";
import type { Product } from "components/product/productOption";
import ProductOption from "components/product/productOption";
import { Collection, HomeDelivery } from "helpers/productPrice/fulfilmentOptions";
import type { PaperFulfilmentOptions } from "helpers/productPrice/fulfilmentOptions";
import LinkTo from "./linkTo";
export type PropTypes = {
  activeTab: PaperFulfilmentOptions;
  setTabAction: (arg0: PaperFulfilmentOptions) => void;
  products: Product[];
};
const pricesSection = css`
  padding: 0 ${space[3]}px ${space[12]}px;
`;
const priceBoxes = css`
  margin-top: ${space[6]}px;
  justify-content: flex-start;
  ${from.tablet} {
    margin-top: ${space[12]}px;
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
  ${headline.medium({
  fontWeight: 'bold'
})};
`;
const pricesInfo = css`
  margin-top: ${space[6]}px;
`;
const pricesTabs = css`
  margin-top: ${space[6]}px;
  display: flex;
  border-bottom: 1px solid ${brand[600]};
`;

function Prices({
  activeTab,
  setTabAction,
  products
}: PropTypes) {
  const infoText = `${activeTab === HomeDelivery ? 'Delivery is included. ' : ''}You can cancel your subscription at any time`;
  return <section css={pricesSection} id="subscribe">
      <h2 css={pricesHeadline}>Pick your subscription package below</h2>
      <FlexContainer cssOverrides={priceBoxes}>
        {products.map(product => <ProductOption cssOverrides={product.label ? productOverrideWithLabel : productOverride} title={product.title} price={product.price} priceCopy={product.priceCopy} offerCopy={product.offerCopy} buttonCopy={product.buttonCopy} href={product.href} onClick={product.onClick} onView={product.onView} label={product.label} />)}
      </FlexContainer>
      <div css={pricesTabs}>
        <LinkTo tab={Collection} setTabAction={setTabAction} activeTab={activeTab} isPricesTabLink>
          Subscription card
        </LinkTo>
        <LinkTo tab={HomeDelivery} setTabAction={setTabAction} activeTab={activeTab} isPricesTabLink>
          Home Delivery
        </LinkTo>
      </div>
      <div css={pricesInfo}>
        <ProductInfoChip icon={<SvgInfo />}>
          {infoText}
        </ProductInfoChip>
      </div>
    </section>;
}

export default Prices;