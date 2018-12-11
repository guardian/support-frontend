// @flow

import React from 'react';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import { getMemLink, getPatronsLink } from 'helpers/externalLinks';

import OtherProduct from './otherProduct';

export default function OtherProducts() {
  return (
    <ProductPageContentBlock modifierClasses={['other-products']}>
      <ProductPageTextBlock title="Other ways you can support us">
        <OtherProduct
          title="The Guardian Patrons"
          description="Support from our Patrons is crucial to ensure that generations to come will be able to enjoy The Guardian"
          destination={getPatronsLink()}
          modifierClass="patrons"
        />
        <OtherProduct
          title="Masterclasses &amp; Live Events"
          description="Meet Guardian journalists and readers at our events, debates, interviews and festivals"
          destination={getMemLink('events')}
          modifierClass="masterclass"
        />
      </ProductPageTextBlock>
    </ProductPageContentBlock>
  );
}
