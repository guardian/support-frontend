// @flow

// ----- Imports ----- //
import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridPicture, { type PropTypes as GridPictureProps } from 'components/gridPicture/gridPicture';
import { CirclesLeft, CirclesRight } from 'components/svgs/digitalSubscriptionLandingHeaderCircles';
import PriceCtaContainer from './priceCtaContainer';


// ----- Setup ----- //

const pictureSources = [
  {
    gridId: 'digitalSubscriptionHeaderMobile',
    sizes: '240px',
    media: '(max-width: 739px)',
    srcSizes: [342, 684, 1200],
    imgType: 'png',
  },
  {
    gridId: 'digitalSubscriptionHeaderTablet',
    sizes: '407px',
    media: '(min-width: 740px) and (max-width: 1139px)',
    srcSizes: [500, 1000, 2000],
    imgType: 'png',
  },
  {
    gridId: 'digitalSubscriptionHeaderDesktop',
    sizes: '809px',
    media: '(min-width: 1140px)',
    srcSizes: [500, 1000, 2000, 4045],
    imgType: 'png',
  },
];

const gridPicture: GridPictureProps = {
  sources: pictureSources,
  fallback: 'digitalSubscriptionHeaderDesktop',
  fallbackSize: 500,
  altText: 'digital subscription',
  fallbackImgType: 'png',
};

export default function DigitalSubscriptionLandingHeader() {
  return (
    <div className="digital-subscription-landing-header">
      <LeftMarginSection modifierClasses={['header-block', 'grey']}>
        <CirclesLeft />
        <CirclesRight />
        <div className="digital-subscription-landing-header__picture">
          <GridPicture {...gridPicture} />
        </div>
        <div className="digital-subscription-landing-header__title">
          <div className="digital-subscription-landing-header__title-copy">
            <h1>Support The Guardian with a digital subscription</h1>
          </div>
        </div>
        <PriceCtaContainer dark referringCta="support_digipack_page_header" />
      </LeftMarginSection>
    </div>
  );
}
