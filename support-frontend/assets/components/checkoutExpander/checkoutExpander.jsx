// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './checkoutExpander.scss';

// ----- Types ----- //

type ExpanderPropTypes = {|
  copy: string,
  children: Node,
|};


// ----- Component ----- //

const CheckoutExpander = ({ copy, children }: ExpanderPropTypes) => (
  <details className="component-checkout-expander">
    <summary className="component-checkout-expander__summary">
      <strong className="component-checkout-expander__strong">{copy}</strong>
    </summary>
    <div className="component-checkout-expander__expando">{children}</div>
  </details>
);


// ----- Exports ----- //

export default CheckoutExpander;
