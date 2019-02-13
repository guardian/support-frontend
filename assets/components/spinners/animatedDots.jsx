// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import './animatedDots.scss';

// ----- Component ----- //

type PropTypes = {
  appearance: 'light' | 'dark',
}

export default function AnimatedDots(props: PropTypes) {
  return (
    <div className={classNameWithModifiers('component-animated-dots', [props.appearance])}>
      <div className="component-animated-dots__bounce1" />
      <div className="component-animated-dots__bounce2" />
      <div className="component-animated-dots__bounce3" />
    </div>
  );
}
