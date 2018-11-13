// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { classNameWithModifiers } from 'helpers/utilities';


// ---- Types ----- //

type PropTypes = {|
  type: 'white' | 'grey' | 'feature' | 'dark',
  id?: ?string,
  children: Node,
  modifierClasses: Array<?string>,
|};


// ----- Render ----- //

const ProductPageContentBlock = ({
  type, children, id, modifierClasses,
}: PropTypes) => (
  <div id={id} className={classNameWithModifiers('component-product-page-content-block', [type, ...modifierClasses])}>
    <LeftMarginSection>
      <div className="component-product-page-content-block__content">
        {children}
      </div>
    </LeftMarginSection>
  </div>
);

ProductPageContentBlock.defaultProps = {
  type: 'white',
  id: null,
  modifierClasses: [],
};


// Exports
export const outsetClassName = 'component-product-page-content-block__outset';
export const bgClassName = 'component-product-page-content-block__bg';

export default ProductPageContentBlock;
