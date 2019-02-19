// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import Colours from '../.storybook/util/colours';
import { paletteAsMap } from '../scripts/pasteup-sass';

const palette = paletteAsMap();
const categories = [...(new Set(Object.keys(palette).map(key => key.split('-')[0])))];

const stories = storiesOf('Palette', module)
  .addDecorator(withKnobs);

const copyHexKnob = () => radios('Copy on click', ['variable', 'hex'], 'variable');

stories.add('Colours', () => (
  <div>
    {categories.map(category => (
      <Colours
        category={category}
        palette={palette}
        copyHex={copyHexKnob() === 'hex'}
      />
    ))}
  </div>
));
