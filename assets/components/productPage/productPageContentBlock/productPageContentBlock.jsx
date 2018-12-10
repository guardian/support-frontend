// @flow

// ----- Imports ----- //

import React, { Children, type Node } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';

import './productPageContentBlock.scss';

// ---- Types ----- //

type PropTypes = {|
  type: 'white' | 'grey' | 'feature' | 'dark' | 'feature-secondary',
  id?: Option<string>,
  children: Node,
  image: Option<Node>,
  modifierClasses: Array<string>,
  needsHigherZindex: boolean
|};


// ----- Render ----- //

const ProductPageContentBlock = ({
  type, children, id, modifierClasses, image, needsHigherZindex,
}: PropTypes) => (
  <div id={id} className={classNameWithModifiers('component-product-page-content-block', [type, image ? 'overflow-hidden' : null, needsHigherZindex ? 'higher' : null, ...modifierClasses])}>
    <LeftMarginSection>
      <div className="component-product-page-content-block__content">
        {children}
        {image &&
          <div className="component-product-page-content-block__image">{image}</div>
        }
      </div>
    </LeftMarginSection>
  </div>
);

ProductPageContentBlock.defaultProps = {
  type: 'white',
  id: null,
  image: null,
  modifierClasses: [],
  needsHigherZindex: false,
};


// ---- Exports ----- //

export const bgClassName = 'component-product-page-content-block-bg';

export default ProductPageContentBlock;
