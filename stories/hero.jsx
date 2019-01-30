// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import ProductPageHero from 'components/productPage/productPageHero/productPageHero';

const stories = storiesOf('Hero', module);

stories.add('Hero', () => (
  <ProductPageHero
    overheading="This overheading is the H1"
    heading="Lemon drizzle waffle confit"
    appearance="feature"
    content="Hero blocks showcase a product and really help set the mood of a page. They work great right under the header!"
  >
    <div style={{ height: '300px' }} />
  </ProductPageHero>
));
