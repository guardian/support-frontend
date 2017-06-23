// @flow

// ----- Imports ----- //

import React from 'react';


// ---- Types ----- //

type PropTypes = {
  heading: string,
  subheading: ?string,
  modifierClass: ?string,
};


// ----- Component ----- //

export default function DoubleHeading(props: PropTypes) {

  let className = 'component-double-heading';

  if (props.modifierClass) {
    className = `${className} ${className}--${props.modifierClass}`;
  }

  const subhead = (
    <h2 className="component-double-heading__subheading">
      { props.subheading }
    </h2>
  );

  return (
    <div className={className}>
      <h1 className="component-double-heading__heading">
        { props.heading }
      </h1>
      { props.subheading ? subhead : '' }
    </div>
  );

}


// ----- Proptypes ----- //

DoubleHeading.defaultProps = {
  subheading: '',
};
