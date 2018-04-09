// @flow

// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import { classNameWithModifiers } from 'helpers/utilities';

import type { Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  subheading: string,
  modifierClass: ?string,
  children?: Node,
  doubleHeadingModifierClass?: string,
  showPaymentLogos?: boolean,
};


// ----- Component ----- //

export default function Bundle(props: PropTypes) {

  const className = classNameWithModifiers('component-bundle', [props.modifierClass]);

  return (
    <div className={className}>
      {props.showPaymentLogos ? <InlinePaymentLogos /> : null}
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
  children: null,
  doubleHeadingModifierClass: '',
  showPaymentLogos: false,
};
