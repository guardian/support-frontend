// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ---- Types ----- //

type PropTypes = {|
  title?: string | null,
  children?: ?Node,
  icon?: ?Node,
  headingSize: HeadingSize,
|};


// ----- Render ----- //

export const largeParagraphClassName = 'component-product-page-text-block__large';
export const ulClassName = 'component-product-page-text-block__ul';

const ProductPageTextBlock = ({
  title, children, headingSize, icon,
}: PropTypes) => (
  <div className="component-product-page-text-block">
    {title && <Heading className="component-product-page-text-block__heading" size={headingSize}>{title}{icon} </Heading>}
    {children}
  </div>
);

ProductPageTextBlock.defaultProps = {
  headingSize: 2,
  children: null,
  icon: null,
  title: null,
};

export default ProductPageTextBlock;
