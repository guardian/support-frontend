// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import Colours from '../.storybook/util/colours';

const stories = storiesOf('Colour palette', module)
  .addDecorator(withKnobs);

const copyHexKnob = () => radios('Copy on click', ['variable', 'hex'], 'variable');

stories.add('Colours', () => (
  <Colours copyHex={copyHexKnob() === 'hex'} />
));
