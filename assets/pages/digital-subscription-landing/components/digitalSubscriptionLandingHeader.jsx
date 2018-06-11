// @flow

// ----- Imports ----- //
import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridPicture from 'components/gridPicture/gridPicture';

import PriceCtaContainer from '../components/priceCtaContainer';


// ----- Setup ----- //

const pictureSources = [
  {
    gridId: 'digitalSubscriptionHeaderMobile',
    sizes: '(min-width: 160px) 240px, (max-width: 739px) 240px',
    media: '(max-width: 739px)',
    srcSizes: [342],
  },
  {
    gridId: 'digitalSubscriptionHeaderTablet',
    sizes: '(min-width: 740px) 407px, (max-width: 1139px) 407px',
    media: '(min-width: 740px) and (max-width: 1139px)',
    srcSizes: [500],
  },
  {
    gridId: 'digitalSubscriptionHeaderDesktop',
    sizes: '(min-width: 1140px) 809px',
    media: '(min-width: 1140px)',
    srcSizes: [1000],
  },
];

const gridPicture = {
  sources: pictureSources,
  fallback: 'digitalSubscriptionHeaderDesktop',
  fallbackSize: 400,
  altText: 'digital subscription',
};

export default function DigitalSubscriptionLandingHeader() {

  return (
    <LeftMarginSection>
      <div className="gridPicture">
        <GridPicture {...gridPicture} />
      </div>
      <div className="headerTitle">
        Support The Guardian with<br />a digital subscription
      </div>
      <PriceCtaContainer dark />
    </LeftMarginSection>
  );
}
