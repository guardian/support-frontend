// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import Header from 'components/headers/header/header';
import Button from 'components/button/button';

import ProductPageHero from 'components/productPage/productPageHero/productPageHero';

const stories = storiesOf('Hero', module);

stories.add('Hero blocks', () => (
  <ProductPageHero
    overheading="This overheading is the H1"
    heading="Lemon drizzle waffle confit"
    appearance="feature"
    cta={<Button aria-label={null} icon={null}>Action</Button>}
  >
    <h1 style={{
      padding: '3em 20px',
      color: '#fff',
      fontSize: '1em',
      width: '10em',
      }}
    >
      Hero blocks showcase a product and really
      help set the mood of a page. They work great right under the header!
    </h1>
  </ProductPageHero>
));
