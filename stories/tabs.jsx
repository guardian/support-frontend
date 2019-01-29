// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, radios } from '@storybook/addon-knobs';
import ProductPageTabs from 'components/productPage/productPageTabs/productPageTabs';

import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

const stories = storiesOf('Buttons', module)
  .addDecorator(withCenterAlignment)
  .addDecorator(withKnobs);

const appearanceKnob = () => radios('Appearance', Object.keys(Appearances), Object.keys(Appearances)[0]);
const iconsKnob = () => radios('Icon', Object.keys(icons), Object.keys(icons)[0]);
const iconSideKnob = () => radios('Icon side', Object.keys(Sides), Object.keys(Sides)[0]);

stories.add('Button button', () => (
  <ProductPageTabs
    appearance={appearanceKnob()}
    aria-label={null}
    icon={icons[iconsKnob()]}
    iconSide={iconSideKnob()}
  >{text('Label', 'Button label')}
  </ProductPageTabs>
));
