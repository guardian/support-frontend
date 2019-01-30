// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridPicture from 'components/gridPicture/gridPicture';

import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';

import './productPageHero.scss';
import './productPageHeroSale.scss';

// ---- Types ----- //

type PropTypes = {|
  overheading: string,
  type: 'grey' | 'feature' | 'custom',
  heading: string,
  cta?: Option<Node>,
  modifierClasses: Array<?string>,
|};


// ----- Render ----- //

const ProductPageHeroSale = ({
  overheading, heading, cta, modifierClasses, type,
}: PropTypes) => (
  <header>
    <div className={classNameWithModifiers('component-product-page-hero', [...modifierClasses, type])}>
      <LeftMarginSection>
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

ProductPageHeroSale.defaultProps = {
  modifierClasses: [],
  children: null,
  cta: null,
  type: 'grey',
};


export default ProductPageHeroSale;
