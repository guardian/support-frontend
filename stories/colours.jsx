// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import Colours from '../.storybook/util/colours';

const categories = {
  brand: ['brand-dark', 'brand-main', 'brand-pastel'],
  neutrals: ['brightness-7', 'brightness-20', 'brightness-46', 'brightness-60', 'brightness-86', 'brightness-93', 'brightness-97', 'brightness-100'],
  highlight: ['highlight-main', 'highlight-dark'],
  green: ['green-main', 'green-dark'],
  state: ['state-error', 'state-success'],
  news: ['news-dark', 'news-main', 'news-bright', 'news-pastel', 'news-faded'],
  opinion: ['opinion-dark', 'opinion-main', 'opinion-bright', 'opinion-pastel', 'opinion-faded'],
  sport: ['sport-dark', 'sport-main', 'sport-bright', 'sport-pastel', 'sport-faded'],
  culture: ['culture-dark', 'culture-main', 'culture-bright', 'culture-pastel', 'culture-faded'],
  lifestyle: ['lifestyle-dark', 'lifestyle-main', 'lifestyle-bright', 'lifestyle-pastel', 'lifestyle-faded'],
};

const stories = storiesOf('Colour palette', module)
  .addDecorator(withKnobs);

const copyHexKnob = () => radios('Copy on click', ['variable', 'hex'], 'variable');

stories.add('Colours', () => (
  <Colours categories={categories} copyHex={copyHexKnob() === 'hex'} />
));
