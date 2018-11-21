// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';


// ---- Types ----- //

type PropTypes = {|
  overheading: string,
  type: 'grey' | 'feature',
  heading: string,
  headline?: Option<string>,
  cta?: Option<Node>,
  children?: Option<Node>,
  modifierClasses: Array<?string>,
|};


// ----- Render ----- //

const ProductPageHero = ({
  headline, overheading, heading, cta, modifierClasses, children, type,
}: PropTypes) => (
  <header>
    <div className={classNameWithModifiers('component-product-page-hero', [...modifierClasses, type])}>
      <LeftMarginSection>
        {headline &&
        <p className="component-product-page-hero__headline">
          {headline}
        </p>
        }
        {children}
        <HeadingBlock overheading={overheading} heading={heading} />
      </LeftMarginSection>
    </div>
    {cta &&
    <div className="component-product-page-hero-hanger">
      <LeftMarginSection>
        <div className="component-product-page-hero-hanger__content">
          {cta}
        </div>
      </LeftMarginSection>
    </div>
    }
  </header>
);

ProductPageHero.defaultProps = {
  modifierClasses: [],
  children: null,
  cta: null,
  headline: null,
  type: 'grey',
};


export default ProductPageHero;
