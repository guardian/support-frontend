// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { type Option } from 'helpers/types/option';

import SvgInfo from 'components/svgs/information';

import './productPageInfoChip.scss';

// ---- Types ----- //


type PropTypes = {|
  children: Node,
  icon: Option<Node>
|};


// ----- Render ----- //

const ProductPageInfoChip = ({
  children, icon,
}: PropTypes) => (
  <div className="component-product-page-info-chip">
    {icon}
    {children}
  </div>
);

ProductPageInfoChip.defaultProps = {
  icon: null,
};

export default ProductPageInfoChip;
