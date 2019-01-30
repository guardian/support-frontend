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
  type: 'grey' | 'feature' | 'sale',
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
        <div className="component-product-page-hero__sale">

          <div className="component-product-page-hero__sale-copy">
            <h2>Works with different browsers</h2>
            <p>Get your hands on journalism that’s really worth keeping.</p>
          </div>

          <div className="component-product-page-hero__sale-graphic-outer">
            <div className="component-product-page-hero__sale-graphic-inner">
              <div className="component-product-page-hero__sale-badge">
                <span>Save up to</span>
                <span>52%</span>
                <span>For 3 months</span>
              </div>
              <div className="component-product-page-hero__sale-graphic">
                <GridPicture
                  sources={[
                    {
                      gridId: 'paperLandingSale',
                      srcSizes: [800, 466],
                      imgType: 'png',
                    },
                  ]}
                  altText="A couple sit together sharing one newspaper"
                  fallbackImgType="png"
                />
              </div>
            </div>

          </div>
        </div>
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
