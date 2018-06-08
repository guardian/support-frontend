// @flow

// ----- Imports ----- //

import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import FeatureList from 'components/featureList/featureList';
import GridImage from 'components/gridImage/gridImage';
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
        <div className="product-block__product product-block__product--premium-app">
          <div className="product-block__image">
            <GridImage
              gridId="premiumTier"
              altText="the premium tier on the guardian app"
              {...imageProperties}
            />
          </div>
          <div className="product-block__copy">
            <h3 className="product-block__product-heading">App premium tier</h3>
            <p className="product-block__product-description">
              Exciting new app features available for mobile and tablet users with
              a digital subscription
            </p>
            <FeatureList
              headingSize={4}
              listItems={[
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
          </div>
        </div>
        <div className="product-block__ampersand">&</div>
        <div className="product-block__product product-block__product--daily-edition">
          <div className="product-block__image">
            <GridImage
              gridId="dailyEdition"
              altText="the guardian daily edition app"
              {...imageProperties}
            />
            <SvgPennyFarthingCircles />
          </div>
          <div className="product-block__copy">
            <h3 className="product-block__product-heading">iPad daily edition</h3>
            <p className="product-block__product-description">
              Exciting new app features available for mobile and tablet users with
              a digital subscription
            </p>
            <FeatureList
              headingSize={4}
              listItems={[
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
          </div>
        </div>
        <PriceCtaContainer />
      </LeftMarginSection>
    </div>
  );

}
