// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import Heading  from 'components/heading/heading';


// ---- Types ----- //

type PropTypes = {
  heading: string,
  subheading?: string,
  modifierClass?: string,
};


// ----- Component ----- //

export default function DoubleHeading(props: PropTypes) {

  const className = classNameWithModifiers('component-double-heading', [props.modifierClass]);

  return (
    <Heading size={3} className={className}>
      <span className="component-double-heading__heading">{ props.heading }</span>
      <span className="component-double-heading__subheading">{ props.subheading }</span>
    </Heading>
  );

}


// ----- Proptypes ----- //

DoubleHeading.defaultProps = {
  subheading: '',
  modifierClass: '',
};
