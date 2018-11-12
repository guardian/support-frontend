// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ---- Types ----- //

type PropTypes = {|
  title: string, children?: ?Node, headingSize: HeadingSize,
|};


// ----- Render ----- //

const ProductPageTextBlock = ({ title, children, headingSize }: PropTypes) => (
  <div className="component-product-page-text-block">
    <Heading className="component-product-page-text-block__heading" size={headingSize}>{title}</Heading>
    {children}
  </div>
);

ProductPageTextBlock.defaultProps = {
  headingSize: 2,
  children: null,
};

export default ProductPageTextBlock;
