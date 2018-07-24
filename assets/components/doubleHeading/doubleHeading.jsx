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
      <h3>
        <span className="component-double-heading__heading">{ props.heading }</span>
        <span className="component-double-heading__subheading">{ props.subheading }</span>
      </h3>
    </div>
  );

}


// ----- Proptypes ----- //

DoubleHeading.defaultProps = {
  subheading: '',
  modifierClass: '',
};
