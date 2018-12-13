// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './productPageContentBlock.scss';

/*
`ContentBlock` will, by default, apply a padding to all its children.
If you want an element to not have that padding, wrapping it in this module
will cancel out the padding and make it flush with the borders.

Using this component instead of cancelling out the padding yourself via CSS
ensures there's always a 1:1 relation between the padding in ContentBlock and
all the elements that cancel the padding, making changes to the padding trivial
*/


// ----- Render ----- //

const productPageContentBlockOutset = ({ children }: {children: Node}) => (
  <div className="component-product-page-content-block-outset">
    {children}
  </div>

);

// ---- Exports ----- //

export default productPageContentBlockOutset;
