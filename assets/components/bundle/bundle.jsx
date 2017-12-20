// @flow

// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import Secure from 'components/secure/secure';
import { generateClassName } from 'helpers/utilities';

import type { Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  subheading: string,
  modifierClass: ?string,
  children?: Node,
  doubleHeadingModifierClass?: string,
  showPaymentLogos?: boolean,
  showSecureLogo?: boolean
};


// ----- Component ----- //

export default function Bundle(props: PropTypes) {

  const className = generateClassName('component-bundle', props.modifierClass);

  return (
    <div className={className}>
      <div style={{ float: 'right' }}>
        {props.showPaymentLogos ? <InlinePaymentLogos /> : null}
        {props.showSecureLogo ? <Secure style={{ textAlign: 'right', paddingTop: '5px' }} /> : null}
      </div>
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
  showSecureLogo: false,
};
