// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ---- Types ----- //

type PropTypes = {|
  items: (string | Node)[]
|};


// ----- Render ----- //

const ProductPageTextBlockList = ({
  items,
}: PropTypes) => (
  <ul className="component-product-page-text-block__ul">
    {items.map(item => (
      <li className="component-product-page-text-block__li">{item}</li>
    ))}
  </ul>
);

export default ProductPageTextBlockList;
