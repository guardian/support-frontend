// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import ProductPageHero, { ProductPageHeroHanger, ProductPageHeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';

const stories = storiesOf('Hero', module);

stories.add('Default', () => (
  <ProductPageHero
    overheading="This overheading is the H1"
    heading="Lemon drizzle waffle confit"
    appearance="feature"
    content="Hero blocks showcase a product and really help set the mood of a page. They work great right under the header!"
  >
    <div style={{ height: '300px' }} />
  </ProductPageHero>
));

stories.add('Custom', () => (
  <div>
    <ProductPageHeroWrapper
      appearance="feature"
    >
      <div style={{ height: '50px' }} />
      <HeadingBlock heading="Hero exports smaller components you can remix and reuse" />
    </ProductPageHeroWrapper>
    <ProductPageHeroWrapper >
      <div style={{ height: '50px' }} />
      <HeadingBlock heading="So you can use different headings" />
    </ProductPageHeroWrapper>
    <ProductPageHeroHanger>And hangers</ProductPageHeroHanger>
    <ProductPageHeroWrapper >
      <div style={{ padding: '50px 10px' }}>
        <ProductPageTextBlock>
          <LargeParagraph>
           or just wing it and not even use a heading!
          </LargeParagraph>
        </ProductPageTextBlock>
      </div>
    </ProductPageHeroWrapper>
  </div>
));

