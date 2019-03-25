// @flow

import React, { type Node } from 'react';

import './layout.scss';
import { classNameWithModifiers } from 'helpers/utilities';


type PropTypes = {
  children: Node,
  aside: ?Node,
};
const Layout = ({ children, aside }: PropTypes) => (
  <div className={classNameWithModifiers('component-checkout', [aside ? 'aside' : null])}>
    <div className="component-checkout__form">
      {children}
    </div>
    {aside &&
    <div className="component-checkout__aside">
      {aside}
    </div>
    }
  </div>
);

Layout.defaultProps = {
  aside: null,
};

export default Layout;
