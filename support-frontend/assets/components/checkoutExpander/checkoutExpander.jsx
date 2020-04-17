// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './checkoutExpander.scss';
import type { Option } from 'helpers/types/option';

// ----- Types ----- //

type ExpanderPropTypes = {|
  copy: string,
  children: Node,
  open: boolean,
  onToggle: Option<Function>,
|};


// ----- Component ----- //

const CheckoutExpander = ({
  copy, children, open, onToggle,
}: ExpanderPropTypes) => (
  <details className="component-checkout-expander" open={open} onToggle={onToggle}>
    <div className="component-checkout-expander__expando">{children}</div>
    <summary className="component-checkout-expander__summary">
      <strong className="component-checkout-expander__strong">{copy}</strong>
    </summary>
  </details>
);

CheckoutExpander.defaultProps = {
  open: false,
  onToggle: null,
};


// ----- Exports ----- //

export default CheckoutExpander;
