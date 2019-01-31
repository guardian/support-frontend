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

type PropTypes = {|
  countryGroupId: CountryGroupId,
|};


// ----- Setup ----- //

const imageSlot = '(max-width: 480px) 100vw, (max-width: 660px) 460px, 345px';

const defaultFeatures: ListItem[] = [
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
  {
    heading: 'Complete the daily crossword',
    text: 'Get our daily crossword wherever you are',
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
      heading: ['Live news and sport ', <mark className="product-block__highlight">New</mark>],
      text: 'Catch up on every breaking story from Australia and the world, in real time',
    },
    {
      heading: 'Enhanced offline reading',
      text: 'Quality journalism on your schedule - download the day\'s news before you travel',
    },
    {
      heading: 'Complete the daily crossword',
      text: 'Get our daily crossword wherever you are',
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

function getDailyEditionCopy(countryGroupId: CountryGroupId) {
  if (countryGroupId === 'GBPCountries') {
    return {
      description: 'Every issue of The Guardian and Observer, designed for your iPad and available offline',
      onTheGoText: 'Your complete daily newspaper, beautifully designed for your iPad',
    };
  }
  return {
    description: 'Every issue of The Guardian and Observer UK newspapers, designed for your iPad and available offline',
    onTheGoText: 'Your complete daily UK newspaper, beautifully designed for your iPad',
  };

}


// ----- Component ----- //

function ProductBlock(props: PropTypes) {
  const dailyEditionCopy = getDailyEditionCopy(props.countryGroupId);
  return (
    <div className="product-block">
      <LeftMarginSection>
        <div className="product-block__heading-wrapper">
          <h2 className="product-block__heading">
            Read the Guardian ad-free on all your devices, plus get all the
            benefits of the Premium App and Daily Edition iPad app
          </h2>
        </div>
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
            srcSizes: [500, 140],
            sizes: imageSlot,
            imgType: 'png',
          }}
          companionSvg={<SvgPennyFarthingCircles />}
          heading="iPad daily edition"
          description={dailyEditionCopy.description}
          features={[
            {
              heading: 'On-the-go reading',
              text: dailyEditionCopy.onTheGoText,
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
        <CtaSwitch />
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
