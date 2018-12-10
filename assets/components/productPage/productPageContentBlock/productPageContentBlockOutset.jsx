// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './productPageContentBlock.scss';


// ----- Render ----- //

const productPageContentBlockOutset = ({ children }: {children: Node}) => (
  <div className="component-product-page-content-block-outset">
    {children}
  </div>

);

// ---- Exports ----- //

export default productPageContentBlockOutset;
