// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import SvgInfo from 'components/svgs/information';

// ---- Types ----- //


type PropTypes = {|
  children: Node
|};


// ----- Render ----- //

export default({
  children,
}: PropTypes) => (
  <div className="component-product-page-info-chip">
    <SvgInfo />
    {children}
  </div>
);
