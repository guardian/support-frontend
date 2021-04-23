// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import WeeklyNewsstand from 'components/interactives/weeklyNewsstand';
import WeeklyStack from 'components/interactives/weeklyStack';
import { withKnobs } from '@storybook/addon-knobs';

const stories = storiesOf('Interactives', module)
  .addDecorator(withKnobs);

stories.add('Guardian Weekly Newsstand', () => (
  <div style={{
      display: 'flex',
      minHeight: '100vh',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div>
      <WeeklyNewsstand />
    </div>
  </div>
));

stories.add('Guardian Weekly stack', () => (
  <div style={{
      display: 'flex',
      padding: '10px',
      minHeight: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <WeeklyStack />
  </div>
));
