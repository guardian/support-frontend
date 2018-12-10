// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import { classNameWithModifiers } from 'helpers/utilities';

import './productPageTextBlock.scss';

// ---- Types ----- //

type PropTypes = {|
  title?: string | null,
  children?: ?Node,
  icon?: ?Node,
  headingSize: HeadingSize,
|};


// ----- Render ----- //

export const largeParagraphClassName = 'component-product-page-text-block__large';
export const sansParagraphClassName = 'component-product-page-text-block__sans';

const ProductPageTextBlock = ({
  title, children, headingSize, icon,
}: PropTypes) => (
  <div className={classNameWithModifiers('component-product-page-text-block', children ? ['heading-only'] : [])}>
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
