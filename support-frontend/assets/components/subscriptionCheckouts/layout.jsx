// @flow

import React, { type Node } from 'react';

import './layout.scss';


type PropTypes = {
  children: Node,
};
const Layout = ({ children }: PropTypes) => (
  <div className="component-checkout">
    <div className="component-checkout__form">
      {children}
    </div>
  </div>
);

export default Layout;
