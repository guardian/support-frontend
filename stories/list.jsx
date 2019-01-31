// @flow

import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';

import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import UnorderedList from 'components/list/unorderedList';
import OrderedList from 'components/list/orderedList';

import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

const stories = storiesOf('Lists', module)
  .addDecorator(withCenterAlignment);

stories.add('Lists', () => (
  <ProductPageTextBlock title="Lists">
    <UnorderedList items={[
      'This is an unordered list',
      'It looks like this',
    ]}
    />
    <OrderedList items={[
      'This one is ordered',
      'and it looks like this',
    ]}
    />
  </ProductPageTextBlock>
));
