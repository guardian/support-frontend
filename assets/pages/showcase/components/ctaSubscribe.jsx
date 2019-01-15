// @flow

import React from 'react';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import GridImage from 'components/gridImage/gridImage';
import UiAnchorButton from 'components/ui/uiButton/uiAnchorButton';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';

export default function CtaSubscribe() {
  return (
    <ProductPageContentBlock
      type="feature"
      modifierClasses={['subscribe']}
      image={<GridImage gridId="showcaseSubscribe" srcSizes={[1000, 500]} sizes="(max-width: 740px) 90vw, 600px" imgType="png" />}
    >
      <ProductPageTextBlock title="Subscribe">
        <p>
          From the Digital Pack, to the new Guardian Weekly magazine to the daily newspaper,
          you can subscribe to the Guardian <strong>for as little as 99p a day.</strong>
        </p>
        <UiAnchorButton icon={<ArrowRightStraight />} href="/subscribe">Choose a Subscription</UiAnchorButton>
      </ProductPageTextBlock>
    </ProductPageContentBlock>
  );
}
