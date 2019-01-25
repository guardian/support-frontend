// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';

const stories = storiesOf('Header', module);

stories.add('Header', () => (
  <SimpleHeader />
));

stories.add('Header (with navigation)', () => (
  <SimpleHeader displayNavigation />
));
