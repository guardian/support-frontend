// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import List from 'components/list/List';

const stories = storiesOf('Content elements', module);

stories.add('List', () => (
  <List items={[
    { explainer: 'This is a list' },
    { explainer: 'You can put items in it, even if they\'re long sentences that will definitely overflow and wrap on mobile' },
    { explainer: 'It\'s very nice' },
  ]}
  />
));
