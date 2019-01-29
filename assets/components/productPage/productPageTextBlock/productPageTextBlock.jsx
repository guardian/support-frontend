// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import { classNameWithModifiers } from 'helpers/utilities';

import './productPageTextBlock.scss';

// ---- Types ----- //

type PropTypes = {|
  title?: string | null,
  callout?: string | null,
  children?: ?Node,
  icon?: ?Node,
  headingSize: HeadingSize,
|};


// ----- Render ----- //

const ProductPageTextBlock = ({
  title, children, headingSize, icon, callout,
}: PropTypes) => (
  <div className={classNameWithModifiers('component-product-page-text-block', children ? ['heading-only'] : [])}>
    {title && <Heading className="component-product-page-text-block__heading" size={headingSize}>{title}{icon} </Heading>}
    {callout && <p className="component-product-page-text-block__callout"><strong>{callout}</strong></p>}
    {children}
  </div>
);

ProductPageTextBlock.defaultProps = {
  headingSize: 2,
  children: null,
  callout: null,
  icon: null,
  title: null,
};


// ----- Children ----- //

export const LargeParagraph = ({ children }: {children: Node}) => <p className="component-product-page-text-block__large">{children}</p>;
export const SansParagraph = ({ children }: {children: Node}) => <p className="component-product-page-text-block__sans">{children}</p>;


// ----- Exports ----- //

export default ProductPageTextBlock;
