// @flow

import React from 'react';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, {
  largeParagraphClassName,
} from 'components/productPage/productPageTextBlock/productPageTextBlock';

export default function WhySupportMatters() {
  return (
    <ProductPageContentBlock>
      <ProductPageTextBlock title="Why your support matters">
        <p className={largeParagraphClassName}>
          Unlike many news organisations, we have kept our journalism open to our global audience.
          We have not put up a paywall as we believe everyone deserves access to quality journalism,
          at a time when factual, honest reporting is critical.
        </p>
      </ProductPageTextBlock>
    </ProductPageContentBlock>
  );
}
