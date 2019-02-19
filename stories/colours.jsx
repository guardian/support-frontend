// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import Colours from '../.storybook/util/colours';

const { paletteAsMap } = require('../scripts/pasteup-sass');

const palette = paletteAsMap();

const categories = [...(new Set(Object.keys(palette).map(key => key.split('-')[0])))];

const stories = storiesOf('Colour palette', module)
  .addDecorator(withKnobs);

const copyHexKnob = () => radios('Copy on click', ['variable', 'hex'], 'variable');

stories.add('Colours', () => (
  <Colours categories={categories} palette={palette} copyHex={copyHexKnob() === 'hex'} />
));
