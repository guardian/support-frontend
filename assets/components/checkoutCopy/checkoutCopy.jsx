// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {|
  strong: string,
  copy: string,
|};


// ----- Component ----- //

function CheckoutCopy(props: PropTypes) {
  return (
    <p className="component-checkout-copy">
      <strong className="component-checkout-copy__strong">{props.strong}</strong>
      {props.copy}
    </p>
  );
}


// ----- Exports ----- //

export default CheckoutCopy;
