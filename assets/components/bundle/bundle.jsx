// @flow

// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import { generateClassName } from 'helpers/utilities';

import type { Children } from 'react';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  subheading: string,
  modifierClass: ?string,
  children?: Children,
  doubleHeadingModifierClass?: string,
  showPaymentLogos?: boolean,
};


// ----- Component ----- //

export default function Bundle(props: PropTypes) {

  const className = generateClassName('component-bundle', props.modifierClass);
  let paymentLogos = '';

  if (props.showPaymentLogos) {
    paymentLogos = <InlinePaymentLogos />;
  }

  return (
    <div className={className}>
      {paymentLogos}
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
  showPaymentLogos: false,
};
