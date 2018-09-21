// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import FeatureList, { type ListItem } from 'components/featureList/featureList';
import GridImage, { type GridImg } from 'components/gridImage/gridImage';
import SvgPennyFarthingCircles from 'components/svgs/pennyFarthingCircles';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import CtaSwitch from './ctaSwitch';


// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};


// ----- Setup ----- //

const imageSlot = '(max-width: 480px) 100vw, (max-width: 660px) 460px, 345px';

const defaultFeatures: ListItem[] = [
  {
    heading: ['Discover ', <mark className="product-block__highlight">New</mark>],
    text: 'A selection of long reads, interviews and features to be read at leisure',
  },
  {
    heading: ['Live ', <mark className="product-block__highlight">New</mark>],
    text: 'A fast way to catch up on every news story as it breaks',
  },
  {
    heading: 'Complete the daily crossword',
    text: 'Get our daily crossword wherever you are',
  },
  {
    heading: 'Ad-free reading',
    text: 'Read the news with no distractions',
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
      text: 'Read the news with no distractions',
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
          Read the Guardian ad-free on all your devices,
          plus get all the benefits of the Premium App and Daily Edition iPad app
        </h2>
        <Product
          modifierClass="premium-app"
          imageProps={appImages[props.countryGroupId]}
          companionSvg={null}
          heading="App premium tier"
          description="Exciting new app features available for mobile and tablet users with a digital subscription"
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
          heading="iPad daily Edition"
          description="Enjoy the daily UK newspaper and all of our supplements, specially designed to be read on the iPad"
          features={[
            {
              heading: 'Read on the go',
              text: 'Your complete daily newspaper, designed for iPad and available offline',
            },
            {
              heading: 'Never wait for the news',
              text: 'Downloads automatically at 4am every day, so it\'s there when you wake up',
            },
            {
              heading: 'Get every supplement',
              text: 'Including Weekend, Feast and Observer Food Monthly',
            },
            {
              heading: 'Enjoy our journalism at your own pace',
              text: 'Access to your own 30-day archive',
            },
          ]}
        />
        <CtaSwitch referringCta="support_digipack_page_product_benefits_section" />
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
