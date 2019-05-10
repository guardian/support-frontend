// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import Header from 'components/headers/header/header';

const stories = storiesOf('Header', module);

stories.add('Header (navigation)', () => (
  <Header display="navigation" />
));

stories.add('Header (checkout)', () => (
  <Header display="checkout" />
));
