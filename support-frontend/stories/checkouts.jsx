// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';

const stories = storiesOf('Checkouts', module);

stories.add('Checkout Expander', () => (
  <CheckoutExpander copy="Expand this">
    <p>For some additional information</p>
  </CheckoutExpander>
));
