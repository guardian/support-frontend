// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';


import ContributionTicker from 'components/ticker/contributionTicker';
import { withKnobs } from '@storybook/addon-knobs/src/index';
import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';


const stories = storiesOf('Tickers', module)
  .addDecorator(withKnobs)
  .addDecorator(withCenterAlignment);

stories.add('Contribution ticker', () => (
  <div style={{ width: '100%', maxWidth: '500px' }}>
    <ContributionTicker
      tickerCountType="money"
      onGoalReached={() => {}}
      tickerEndType="unlimited"
      currencySymbol="£"
      copy={{
        countLabel: 'contributors',
        goalReachedPrimary: 'You can still support us today',
        goalReachedSecondary: 'thank you - we\'re over our goal',
      }}
    />
  </div>
));
