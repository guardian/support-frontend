// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';

import './productPageHero.scss';

// ---- Types ----- //

type PropTypes = {|
  overheading: string,
  appearance: 'grey' | 'feature' | 'custom',
  heading: string,
  content?: Option<Node>,
  overContent?: Option<Node>,
  children?: Option<Node>,
  modifierClasses: Array<?string>,
|};


// ----- Render ----- //

const ProductPageHero = ({
  overheading, heading, content, overContent, modifierClasses, children, appearance,
}: PropTypes) => (
  <header>
    <div className={classNameWithModifiers('component-product-page-hero', [...modifierClasses, appearance])}>
      <LeftMarginSection>
        {children}
        <HeadingBlock overheading={overheading} heading={heading} />
        {overContent &&
        <div className="component-product-page-hero-content">
          {overContent}
        </div>
        }
      </LeftMarginSection>
    </div>
    {content &&
    <div className={classNameWithModifiers('component-product-page-hero-hanger', ['bottom'])}>
      <LeftMarginSection>
        <div className="component-product-page-hero-content">
          {content}
        </div>
      </LeftMarginSection>
    </div>
    }
  </header>
);

ProductPageHero.defaultProps = {
  modifierClasses: [],
  children: null,
  content: null,
  overContent: null,
  appearance: 'grey',
};


export default ProductPageHero;
