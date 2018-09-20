// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import FeatureList, { type ListItem } from 'components/featureList/featureList';
import GridImage, { type GridImg } from 'components/gridImage/gridImage';
import SvgPennyFarthingCircles from 'components/svgs/pennyFarthingCircles';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import PriceCtaContainer from './priceCtaContainer';


// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};


// ----- Setup ----- //

const imageSlot = '(max-width: 480px) 100vw, (max-width: 660px) 460px, 345px';

const defaultFeatures: ListItem[] = [
  {
    heading: 'Ad-free reading',
    text: 'Independent reporting with no distractions',
  },
  {
    heading: ['Live ', <mark className="product-block__highlight">New</mark>],
    text: 'Catch up on every news story as it breaks',
  },
  {
    heading: ['Discover ', <mark className="product-block__highlight">New</mark>],
    text: 'Explore a beautifully curated feed of features, reviews and opinion',
  },
  {
    heading: 'Enhanced offline reading',
    text: 'Quality journalism on your schedule - download the day\'s news before you travel',
  },
];

const appFeatures: {
  [CountryGroupId]: ListItem[],
} = {
  GBPCountries: defaultFeatures,
  UnitedStates: defaultFeatures,
  International: defaultFeatures,
  AUDCountries: [
    {
      heading: 'Ad-free reading',
      text: 'Independent reporting with no distractions',
    },
    {
      heading: 'Complete the daily crossword',
      text: 'Get our daily crossword wherever you are',
    },
    {
      heading: ['Live news and sport ', <mark className="product-block__highlight">New</mark>],
      text: 'Catch up on every breaking story from Australia and the world, in real time',
    },

  ],
};

const defaultAppImage = {
  gridId: 'premiumTier',
  altText: 'the premium tier on the guardian app',
  srcSizes: [644, 500, 140],
  sizes: imageSlot,
  imgType: 'png',
};

const appImages: {
  [CountryGroupId]: GridImg,
} = {
  GBPCountries: defaultAppImage,
  UnitedStates: defaultAppImage,
  International: defaultAppImage,
  AUDCountries: {
    ...defaultAppImage,
    gridId: 'premiumTierAU',
    srcSizes: [1000, 500, 140],
  },
};


// ----- Component ----- //

function ProductBlock(props: PropTypes) {

  return (
    <div className="product-block">
      <LeftMarginSection>
        <h2 className="product-block__heading">
          Enjoy our quality, independent journalism, plus extra features
          on our mobile and tablet apps
        </h2>
        <Product
          modifierClass="premium-app"
          imageProps={appImages[props.countryGroupId]}
          companionSvg={null}
          heading="App premium tier"
          description="Your enhanced experience of The Guardian for mobile and tablet, with exclusive features and ad-free reading"
          features={appFeatures[props.countryGroupId]}
        />
        <div className="product-block__ampersand">&</div>
        <Product
          modifierClass="daily-edition"
          imageProps={{
            gridId: 'dailyEdition',
            altText: 'the guardian daily edition app',
            srcSizes: [644, 500, 140],
            sizes: imageSlot,
            imgType: 'png',
          }}
          companionSvg={<SvgPennyFarthingCircles />}
          heading="iPad daily edition"
          description="Every issue of The Guardian and Observer, designed for your iPad and available offline"
          features={[
            {
              heading: 'On-the-go reading',
              text: 'Your complete daily newspaper, beautifully designed for your iPad',
            },
            {
              heading: 'Every supplement',
              text: 'Including Weekend, Review, Feast and Observer Food Monthly',
            },
            {
              heading: 'Journalism at your own pace',
              text: 'Access a month of issues in your 30-day archive',
            },
            {
              heading: 'The news when you need it',
              text: 'Downloads automatically every day, ready for you to read offline',
            },
          ]}
        />
        <PriceCtaContainer referringCta="support_digipack_page_product_benefits_section" />
      </LeftMarginSection>
    </div>
  );

}


// ----- Auxiliary Components ----- //

function Product(props: {
  modifierClass: string,
  imageProps: GridImg,
  companionSvg?: Node,
  heading: string,
  description: string,
  features: ListItem[],
}) {

  return (
    <div className={classNameWithModifiers('product-block__product', [props.modifierClass])}>
      <div className="product-block__image">
        <GridImage {...props.imageProps} />
        {props.companionSvg}
      </div>
      <div className="product-block__copy">
        <h3 className="product-block__product-heading">{props.heading}</h3>
        <p className="product-block__product-description">{props.description}</p>
        <FeatureList
          headingSize={4}
          listItems={props.features}
        />
      </div>
    </div>
  );

}


// ----- Default Props ----- //

Product.defaultProps = {
  companionSvg: null,
};


// ----- Exports ----- //

export default ProductBlock;
