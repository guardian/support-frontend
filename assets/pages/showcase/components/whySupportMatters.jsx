// @flow

import React from 'react';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import Text, {
  LargeParagraph,
} from 'components/text/text';

export default function WhySupportMatters() {
  return (
    <ProductPageContentBlock>
      <Text title="Why your support matters">
        <LargeParagraph>
          Unlike many news organisations, we have kept our journalism open to our global audience.
          We have not put up a paywall as we believe everyone deserves access to quality journalism,
          at a time when factual, honest reporting is critical.
        </LargeParagraph>
      </Text>
    </ProductPageContentBlock>
  );
}
