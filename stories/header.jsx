// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import Header from 'components/headers/header/header';

const stories = storiesOf('Header', module);

stories.add('Header', () => (
  <Header />
));

stories.add('Header (with navigation)', () => (
  <Header displayNavigation />
));
