// @flow

// ----- Imports ----- //

import React from 'react';
import GridPicture from 'components/gridPicture/gridPicture';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import GridImage from 'components/gridImage/gridImage';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import ProductPageHero
  from 'components/productPage/productPageHero/productPageHero';

import './weeklyCampaign.scss';

const HeroImage = () => (
  <GridPicture
    sources={[
        {
          gridId: 'weeklyLandingHero',
          srcSizes: [500, 1000],
          imgType: 'png',
          sizes: '100vw',
          media: '(max-width: 739px)',
        },
        {
          gridId: 'weeklyLandingHero',
          srcSizes: [1000, 2000],
          imgType: 'png',
          sizes: '(min-width: 1000px) 2000px, 1000px',
          media: '(min-width: 740px)',
        },
      ]}
    fallback="weeklyLandingHero"
    fallbackSize={1000}
    altText="A collection of Guardian Weekly magazines"
    fallbackImgType="png"
  />
);

const CampaignHeader = (props: {heading: string, orderIsAGift: boolean}) => (

  <ProductPageHero
    appearance="campaign"
    overheading="Guardian Weekly subscriptions"
    heading={props.heading}
    modifierClasses={props.orderIsAGift ? ['weekly-gift'] : ['weekly-campaign']}
    content={<AnchorButton onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
    hasCampaign
    orderIsAGift={props.orderIsAGift}
  >

    <div className="weekly-campaign-hero">
      <div className={props.orderIsAGift ? 'weekly-gifting-hero__copy' : 'weekly-campaign-hero__copy'}>
        {props.orderIsAGift ? (
          <h2>Give the gift<br />of change</h2>
          ) : (
            <h2>The Guardian<br />Weekly</h2>
          )
        }
      </div>

      {!props.orderIsAGift && (
        <div className="weekly-campaign-hero__graphic">
          <GridImage
            gridId="weeklyCampaignHeroImg"
            srcSizes={[1000, 1358]}
            sizes="(max-width: 740px) 1000px, 1358px"
            imgType="png"
            altText="A collection of Guardian Weekly magazines"
          />
        </div>
      )}

      {props.orderIsAGift && (
        <div className="weekly-campaign-hero__graphic">
          <GridImage
            gridId=""
            srcSizes={[1000, 1358]}
            sizes="(max-width: 740px) 1000px, 1358px"
            imgType="png"
            altText="A collection of Guardian Weekly magazines"
          />
        </div>
      )}

    </div>


  </ProductPageHero>
);


export { CampaignHeader, HeroImage };
