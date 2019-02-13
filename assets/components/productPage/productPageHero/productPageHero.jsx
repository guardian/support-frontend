// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';

import './productPageHero.scss';

// ---- Types ----- //
type WrapperPropTypes = {|
  children: Node,
  modifierClasses: Array<?string>,
  appearance: 'grey' | 'feature' | 'custom',
|};

type PropTypes = {|
  ...WrapperPropTypes,
  overheading: string,
  heading: string,
  content?: Option<Node>,
  overcontent?: Option<Node>,
|};


// ----- Render ----- //

const HeroWrapper = ({
  modifierClasses, children, appearance,
}: WrapperPropTypes) => (
  <div className={classNameWithModifiers('component-product-page-hero', [...modifierClasses, appearance])}>
    <LeftMarginSection>
      {children}
    </LeftMarginSection>
  </div>
);
HeroWrapper.defaultProps = {
  modifierClasses: [],
  appearance: 'grey',
};

const HeroHanger = ({
  children,
}: {children: Node}) => (
  <div className={classNameWithModifiers('component-product-page-hero-hanger', ['bottom'])}>
    <LeftMarginSection>
      <div className="component-product-page-hero-content">
        {children}
      </div>
    </LeftMarginSection>
  </div>
);

const ProductPageHero = ({
  overheading, heading, content, overcontent, modifierClasses, children, appearance,
}: PropTypes) => (
  <header>
    <HeroWrapper {...{ modifierClasses, appearance }}>
      {children}
      <HeadingBlock overheading={overheading} >{heading}</HeadingBlock>
      {overcontent &&
        <div className="component-product-page-hero-content">
          {overcontent}
        </div>
        }
    </HeroWrapper>
    {content &&
      <HeroHanger>{content}</HeroHanger>
    }
  </header>
);

ProductPageHero.defaultProps = {
  children: null,
  content: null,
  overcontent: null,
  ...HeroWrapper.defaultProps,
};

export { HeroHanger, HeroWrapper };

export default ProductPageHero;
