// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
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

const HeroGlobe = () => (
  <div className="weekly-gifting-hero__globe">
    <GridImage
      gridId="giftingGlobe"
      srcSizes={[1000]}
      sizes="(max-width: 740px) 1000px"
      imgType="png"
      altText=""
    />
  </div>
);

const CampaignHeader = (props: {heading: string | Node, orderIsAGift: boolean}) => (
  <ProductPageHero
    appearance="campaign"
    overheading="Guardian Weekly subscriptions"
    heading={props.heading}
    modifierClasses={props.orderIsAGift ? ['weekly-gift'] : ['weekly-campaign']}
    content={!props.orderIsAGift &&
      <AnchorButton
        onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)}
        icon={<SvgChevron />}
        href="#subscribe"
      >
        See Subscription options
      </AnchorButton>
    }
    hasCampaign
    orderIsAGift={props.orderIsAGift}
    giftImage={<HeroGlobe />}
  >

    <div className="weekly-campaign-hero">
      <div className={props.orderIsAGift ? 'weekly-gifting-hero__copy' : 'weekly-campaign-hero__copy'}>
        {props.orderIsAGift ? (
          <h2>Give<br />The Guardian Weekly</h2>
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
        <div className="weekly-campaign-hero__graphic weekly-gift-hero--desktop">
          <GridImage
            gridId="gwGiftingPackshot"
            srcSizes={[1000]}
            sizes="(max-width: 740px) 1000px"
            imgType="png"
            altText="A collection of Guardian Weekly magazines"
          />
        </div>
      )}

      {props.orderIsAGift && (
        <div className="weekly-campaign-hero__graphic weekly-gift-hero--mobile">
          <GridImage
            gridId="gwGiftingPackshotMob"
            srcSizes={[400]}
            sizes="(max-width: 400px) 400px"
            imgType="png"
            altText="A collection of Guardian Weekly magazines"
          />
        </div>
      )}

    </div>


  </ProductPageHero>
);


export { CampaignHeader, HeroImage };
