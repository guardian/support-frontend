// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ---- Types ----- //

type PropTypes = {|
  items: (Node)[]
|};


// ----- Render ----- //

const ProductPageTextBlockOrderedList = ({
  items,
}: PropTypes) => (
  <ol className="component-product-page-text-block__ol">
    {items.map(item => (
      <li className="component-product-page-text-block__li">{item}</li>
    ))}
  </ol>
);

export default ProductPageTextBlockOrderedList;
