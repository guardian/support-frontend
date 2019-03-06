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
  className: ?string,
  appearance: 'grey' | 'feature' | 'custom' | 'campaign',
|};

type PropTypes = {|
  ...WrapperPropTypes,
  overheading: string,
  heading: string,
  hasCampaign: boolean,
  content?: Option<Node>
|};


// ----- Render ----- //

const HeroWrapper = ({
  modifierClasses, children, appearance, className,
}: WrapperPropTypes) => (
  <div className={`${className || ''} ${classNameWithModifiers('component-product-page-hero', [...modifierClasses, appearance])}`}>
    <LeftMarginSection>
      {children}
    </LeftMarginSection>
  </div>
);
HeroWrapper.defaultProps = {
  modifierClasses: [],
  appearance: 'grey',
  className: null,
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

const HeroHeading = ({
  children,
  hasCampaign,
}: {children: Node, hasCampaign: boolean}) => (
  <div className={classNameWithModifiers('component-product-page-hero-heading', [hasCampaign ? 'campaign' : null])}>
    <LeftMarginSection>
      {children}
    </LeftMarginSection>
  </div>
);

const ProductPageHero = ({
  overheading, heading, content, modifierClasses, children, appearance, hasCampaign,
}: PropTypes) => (
  <header>
    <HeroWrapper {...{ modifierClasses, appearance }}>
      {children}
    </HeroWrapper>
    <HeroHeading {...{ hasCampaign }}>
      <HeadingBlock overheading={overheading} >{heading}</HeadingBlock>
    </HeroHeading>
    {content &&
      <HeroHanger>{content}</HeroHanger>
    }
  </header>
);

ProductPageHero.defaultProps = {
  children: null,
  content: null,
  ...HeroWrapper.defaultProps,
};

export { HeroHanger, HeroWrapper, HeroHeading };

export default ProductPageHero;
