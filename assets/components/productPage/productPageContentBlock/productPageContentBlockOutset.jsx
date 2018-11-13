// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ---- Types ----- //

type PropTypes = {|
  children: Node,
|};


// ----- Render ----- //

const ProductPageContentBlockOutset = ({
  children,
}: PropTypes) => (
  <div className="component-product-page-content-block__outset">
    {children}
  </div>
);

export default ProductPageContentBlockOutset;
