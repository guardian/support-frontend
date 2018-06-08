// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import FeatureList, { type ListItem } from 'components/featureList/featureList';
import GridImage, { type GridImg } from 'components/gridImage/gridImage';
import SvgPennyFarthingCircles from 'components/svgs/pennyFarthingCircles';

import PriceCtaContainer from './priceCtaContainer';


// ----- Setup ----- //

const imageProperties = {
  srcSizes: [644, 500, 140],
  sizes: '(max-width: 480px) 100vw, (max-width: 660px) 460px, 345px',
  imgType: 'png',
};


// ----- Component ----- //

export default function ProductBlock() {

  return (
    <div className="product-block">
      <LeftMarginSection>
        <h2 className="product-block__heading">
          Enjoy our quality, independent journalism, plus some extra features,
          on mobile and tablet apps
        </h2>
        <Product
          modifierClass="premium-app"
          imageProps={{
            gridId: 'premiumTier',
            altText: 'the premium tier on the guardian app',
            ...imageProperties,
          }}
          companionSvg={null}
          heading="App premium tier"
          description="Exciting new app features available for mobile and tablet users with a digital subscription"
          features={[
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
          ]}
        />
        <div className="product-block__ampersand">&</div>
        <Product
          modifierClass="daily-edition"
          imageProps={{
            gridId: 'dailyEdition',
            altText: 'the guardian daily edition app',
            ...imageProperties,
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
        <PriceCtaContainer />
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

Product.defaultProps = {
  companionSvg: null,
};
