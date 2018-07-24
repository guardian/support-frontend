// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';


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
    <div className={className}>
      <h3 className="component-double-heading__heading">
        <div>{ props.heading }</div>
        <div className="component-double-heading__subheading">{ props.subheading }</div>
      </h3>
    </div>
  );

}


// ----- Proptypes ----- //

DoubleHeading.defaultProps = {
  subheading: '',
  modifierClass: '',
};
