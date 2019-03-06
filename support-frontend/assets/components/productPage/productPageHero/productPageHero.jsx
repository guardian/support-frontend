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
  content?: Option<Node>,
  hasCampaign: boolean
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
  heading,
  hasCampaign,
  ...props
}: {children:Node, heading:string, hasCampaign:boolean}) => (
  <div className={classNameWithModifiers('component-product-page-hero-heading', [hasCampaign ? 'campaign' : null])}>
    <LeftMarginSection>
      <HeadingBlock {...props}>{heading}</HeadingBlock>
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
    <HeroHeading overheading={overheading} heading={heading} hasCampaign={hasCampaign} />
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
