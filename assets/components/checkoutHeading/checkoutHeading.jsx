// @flow

// ----- Imports ----- //

import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';


// ----- Types ----- //

type PropTypes = {|
  heading: string,
  copy: string,
|};


// ----- Component ----- //

function CheckoutHeading(props: PropTypes) {

  return (
    <div className="component-checkout-heading">
      <LeftMarginSection>
        <h1 className="component-checkout-heading__heading">{props.heading}</h1>
        <p className="component-checkout-heading__copy">{props.copy}</p>
      </LeftMarginSection>
    </div>
  );

}


// ----- Export ----- //

export default CheckoutHeading;
