// @flow

import React, { type Node } from 'react';

import './checkout.scss';


type PropTypes = {
  children: Node,
};
const Checkout = ({ children }: PropTypes) => (
  <div className="component-checkout">
    <div className="component-checkout__form">
      {children}
    </div>
  </div>
);

export default Checkout;
