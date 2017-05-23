// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import DoubleHeading from 'components/doubleHeading/doubleHeading';

import type { Children } from 'react';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  subheading: string,
  modifierClass: string,
  children?: Children,
};


// ----- Component ----- //

function Bundle(props: PropTypes) {

  let className = 'bundles__bundle';

  if (props.modifierClass) {
    className = `${className} ${className}--${props.modifierClass}`;
  }

  return (
    <div className={className}>
      <DoubleHeading
        heading={props.heading}
        subheading={props.subheading}
      />
      <div className="bundle__content">
        {props.children}
      </div>
    </div>
  );

}


// ----- Proptypes ----- //

Bundle.defaultProps = {
  subheading: '',
  infoText: '',
  modifierClass: '',
  children: null,
};


// ----- Exports ----- //

export default connect()(Bundle);
