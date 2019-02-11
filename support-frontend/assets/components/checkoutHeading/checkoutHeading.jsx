// @flow

// ----- Imports ----- //

import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';


// ----- Types ----- //

type PropTypes = {|
  heading: string,
|};


// ----- Component ----- //

function CheckoutHeading(props: PropTypes) {

  return (
    <div className="component-checkout-heading">
      <LeftMarginSection>
        <h1 className="component-checkout-heading__heading">{props.heading}</h1>
      </LeftMarginSection>
    </div>
  );

}


// ----- Export ----- //

export default CheckoutHeading;
