// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import Colours from '../.storybook/util/colours';
import { paletteAsMap } from '../scripts/pasteup-sass';

/*
Get the first part of each colour name and make them unique.
This maps neatly to the exported categories.
*/
const palette = paletteAsMap();
const categories = [...(
  new Set(Object.keys(palette).map(key => key.substr(0, key.indexOf('-'))))
)];

const copyHexKnob = () => radios('Copy on click', ['variable', 'hex'], 'variable');

const stories = storiesOf('Palette', module).addDecorator(withKnobs);

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
