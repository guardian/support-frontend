// @flow

import React, { type Node } from 'react';

import './layout.scss';
import { classNameWithModifiers } from 'helpers/utilities';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

type PropTypes = {
  children: Node,
  aside: ?Node,
};
const Layout = ({ children, aside }: PropTypes) => (
  <div className={classNameWithModifiers('component-checkout', [aside ? 'aside' : null])}>
    {aside &&
      <div className="component-checkout__aside">
        {aside}
      </div>
    }
    <div className="component-checkout__form">
      {children}
    </div>
  </div>
);
Layout.defaultProps = {
  aside: null,
};

const LeftColWrapper = ({ children }: {children: Node}) => (
  <LeftMarginSection className="component-checkout-wrapper">
    {children}
  </LeftMarginSection>
);

export { LeftColWrapper };
export default Layout;
