// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridImage from 'components/gridImage/gridImage';
import SvgWeeklyHeroCircles from 'components/svgs/weeklyHeroCircles';
import { classNameWithModifiers } from 'helpers/utilities';


// ---- Types ----- //

type PropTypes = {|
  overheading: string,
  heading: string,
  headline: string | null,
  cta: Node | null,
  children: Node | null,
  modifierClasses: Array<?string>,
|};


// ----- Render ----- //

const ProductPageHero = ({
  headline, overheading, heading, cta, modifierClasses, children,
}: PropTypes) => (
  <header>
    <div className={classNameWithModifiers('component-product-page-hero', modifierClasses)}>
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
};


export default ProductPageHero;
