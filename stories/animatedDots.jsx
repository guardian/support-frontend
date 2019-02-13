// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';


import AnimatedDots from 'components/spinners/animatedDots';
import { radios, withKnobs } from '@storybook/addon-knobs/src/index';


const appearanceKnob = () => radios('Appearance', ['light', 'dark'], 'light');


const stories = storiesOf('Animated dots', module).addDecorator(withKnobs);

stories.add('Animated dots', () => (
  <div style={{
    background: '#121212',
    display: 'flex',
    padding: '10vh 10vh',
    minHeight: '100vh',
    width: '100vw',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    }}
  >
    <AnimatedDots
      appearance={appearanceKnob()}
    />
  </div>
));
