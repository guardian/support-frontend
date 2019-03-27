// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';


import ContributionTicker from 'components/ticker/contributionTicker';
import { text, withKnobs } from '@storybook/addon-knobs/src/index';
import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';


const tickerJsonUrlInput = () => text('Ticker JSON URL', 'https://support.theguardian.com/ticker.json');

const stories = storiesOf('Tickers', module)
  .addDecorator(withKnobs)
  .addDecorator(withCenterAlignment);

stories.add('Contribution ticker', () => (
  <div style={{ width: '100%', maxWidth: '500px' }}>
    <ContributionTicker
      tickerJsonUrl={tickerJsonUrlInput()}
      onGoalReached={() => {}}
    />
  </div>
));
