// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, radios } from '@storybook/addon-knobs';

import SvgSubscribe from 'components/svgs/subscribe';
import Button from 'components/button/button';
import AnchorButton from 'components/button/anchorButton';
import { Appearances, Sides } from 'components/button/_sharedButton';

import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

const stories = storiesOf('Buttons', module)
  .addDecorator(withCenterAlignment)
  .addDecorator(withKnobs);

const icons = { Default: undefined, None: null, Subscribe: <SvgSubscribe /> };

const appearanceKnob = () => radios('Appearance', Object.keys(Appearances), Object.keys(Appearances)[0]);
const iconsKnob = () => radios('Icon', Object.keys(icons), Object.keys(icons)[0]);
const iconSideKnob = () => radios('Icon side', Object.keys(Sides), Object.keys(Sides)[0]);

stories.add('Button button', () => (
  <Button
    appearance={appearanceKnob()}
    aria-label={null}
    icon={icons[iconsKnob()]}
    iconSide={iconSideKnob()}
  >{text('Label', 'Button label')}
  </Button>
));

stories.add('Anchor button', () => (
  <AnchorButton
    href="#"
    onClick={(ev) => { ev.preventDefault(); }}
    appearance={appearanceKnob()}
    aria-label={null}
    icon={icons[iconsKnob()]}
    iconSide={iconSideKnob()}
  >{text('Label', 'I am a link that looks like a button!')}
  </AnchorButton>
));
