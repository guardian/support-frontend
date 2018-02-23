// @flow

// ----- Imports ----- //

import React from 'react';
import { generateClassName } from 'helpers/utilities';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';


// ---- Types ----- //

type PropTypes = {
  heading: string,
  subheading?: string,
  modifierClass?: string,
  showPaymentLogos?: boolean,
};


// ----- Component ----- //

export default function DoubleHeading(props: PropTypes) {

  const className = generateClassName('component-double-heading', props.modifierClass);

  const paymentLogos = (
    <div style={{ height: '20px', marginTop: '-5px' }}>
      <InlinePaymentLogos />
    </div>
  );

  return (
    <div className={className}>
      <h1 className="component-double-heading__heading">
        { props.heading }
      </h1>
      <h2 className="component-double-heading__subheading">
        { props.subheading }
      </h2>
      {props.showPaymentLogos ? paymentLogos : null}
    </div>
  );

}


// ----- Proptypes ----- //

DoubleHeading.defaultProps = {
  subheading: '',
  modifierClass: '',
  showPaymentLogos: false,
};
