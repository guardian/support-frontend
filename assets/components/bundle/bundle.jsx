// @flow

// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import { generateClassName } from 'helpers/utilities';

import type { Children } from 'react';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  subheading: string,
  modifierClass: ?string,
  children?: Children,
  doubleHeadingModifierClass?: string,
};


// ----- Component ----- //

export default function Bundle(props: PropTypes) {

  const className = generateClassName('component-bundle', props.modifierClass);

  return (
    <div className={className}>
      <DoubleHeading
        heading={props.heading}
        subheading={props.subheading}
        modifierClass={props.doubleHeadingModifierClass}
      />
      <div className="component-bundle__content">
        {props.children}
      </div>
    </div>
  );

}


// ----- Proptypes ----- //

Bundle.defaultProps = {
  subheading: '',
  infoText: '',
  modifierClass: null,
  children: null,
  doubleHeadingModifierClass: null,
};
