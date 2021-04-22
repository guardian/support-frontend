// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import WeeklyNewsstand from 'components/interactives/weeklyNewsstand';
import { withKnobs } from '@storybook/addon-knobs';

const stories = storiesOf('Interactives', module)
  .addDecorator(withKnobs);

stories.add('Guardian Weekly Newsstand', () => (
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
    <WeeklyNewsstand />
  </div>
));
