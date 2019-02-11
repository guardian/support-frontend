// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
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
  needsHigherZindex: boolean,
  border: Option<boolean>,
|};


// ----- Render ----- //

const ProductPageContentBlock = ({
  type, children, id, modifierClasses, image, needsHigherZindex, border,
}: PropTypes) => (
  <div
    id={id}
    className={classNameWithModifiers(
'component-product-page-content-block',
    [
      type,
      image ? 'overflow-hidden' : null,
      needsHigherZindex ? 'higher' : null,
      border === false ? 'no-border' : null,
      border === true ? 'force-border' : null,
      ...modifierClasses,
    ],
)}
  >
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
  border: null,
};


// ---- Children ----- //

/*
Adds a multiline divider between block children.
*/
export const Divider = ({ small }: {small: boolean}) => (
  <div className={classNameWithModifiers('component-product-page-content-block-divider', [
    small ? 'small' : null,
  ])}
  >
    <hr className="component-product-page-content-block-divider__line" />
  </div>
);
Divider.defaultProps = {
  small: false,
};

/*
Cancels out the horizontal padding
Wrap full bleed children in this.
*/
export const Outset = ({ children }: {children: Node}) => (
  <div className="component-product-page-content-block-outset">
    {children}
  </div>
);

/*
A vertical block with max width
*/
export const NarrowContent = ({ children }: {children: Node}) => (
  <div className="component-product-page-content-block__narrowContent">
    {children}
  </div>
);

/*
A css class that sets the background colour to match the block.
Use on children that need to match the background of the parent
*/
export const bgClassName = 'component-product-page-content-block-bg';

// ---- Exports ----- //

export default ProductPageContentBlock;
