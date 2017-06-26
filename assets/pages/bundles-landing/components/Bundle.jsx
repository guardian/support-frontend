// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

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

function Bundle(props: PropTypes) {

  const className = generateClassName('bundles__bundle', props.modifierClass);

  return (
    <div className={className}>
      <DoubleHeading
        heading={props.heading}
        subheading={props.subheading}
        modifierClass={props.doubleHeadingModifierClass}
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
  modifierClass: null,
  children: null,
  doubleHeadingModifierClass: null,
};


// ----- Exports ----- //

export default connect()(Bundle);
