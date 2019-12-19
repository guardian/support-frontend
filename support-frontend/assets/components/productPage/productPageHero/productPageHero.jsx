// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';

// ----- Component Imports ----- //
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

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
  heading: string | Node,
  content?: Option<Node>,
  hasCampaign: boolean,
  showProductPageHeroHeader?: boolean,
  orderIsAGift?: boolean,
  giftImage?: Node,
|};

type ProductPageHeroHeaderTypes = {
  overheading: string,
  hasCampaign: boolean,
  heading: string | Node,
  content?: Option<Node>,
  orderIsAGift?: boolean,
  giftImage?: Node,
}

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
  orderIsAGift,
  giftImage,
}: {children: Node, hasCampaign: boolean, orderIsAGift?: boolean, giftImage?: Node}) => (
  <div className={classNameWithModifiers('component-product-page-hero-heading', [hasCampaign ? 'campaign' : null])}>
    <LeftMarginSection>
      {orderIsAGift && giftImage}
      {children}
    </LeftMarginSection>
  </div>
);

HeroHeading.defaultProps = {
  orderIsAGift: false,
  giftImage: null,
};

const ProductPageHero = ({
  modifierClasses, children, appearance, showProductPageHeroHeader, ...props
}: PropTypes) => (
  <header>
    <HeroWrapper {...{ modifierClasses, appearance }}>
      {children}
    </HeroWrapper>
    {showProductPageHeroHeader && <ProductPageHeroHeader {...props} />}
  </header>
);

const ProductPageHeroHeader = ({
  overheading, heading, content, hasCampaign, orderIsAGift, giftImage,
}: ProductPageHeroHeaderTypes) => (
  <div>
    <HeroHeading {...{ hasCampaign, orderIsAGift, giftImage }}>
      <HeadingBlock
        overheading={orderIsAGift ? 'The Guardian Weekly gift subscription' : overheading}
        orderIsAGift={orderIsAGift}
      >
        {heading}
      </HeadingBlock>
    </HeroHeading>
    {content && <HeroHanger>{content}</HeroHanger>}
  </div>
);

ProductPageHero.defaultProps = {
  children: null,
  content: null,
  ...HeroWrapper.defaultProps,
  showProductPageHeroHeader: true,
};

ProductPageHeroHeader.defaultProps = {
  content: null,
  orderIsAGift: false,
  giftImage: null,
};

export { HeroHanger, HeroWrapper, HeroHeading, ProductPageHeroHeader };
export default ProductPageHero;
