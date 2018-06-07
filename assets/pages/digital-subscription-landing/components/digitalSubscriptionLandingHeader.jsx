// @flow

// ----- Imports ----- //
import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridImage from 'components/gridImage/gridImage';
import type { GridImg } from 'components/gridImage/gridImage';

import PriceCtaContainer from '../components/priceCtaContainer';


// ----- Setup ----- //

const wideImageProps: GridImg = {
  gridId: 'digitalSubscriptionHeaderDesktop',
  altText: 'digital subscription',
  srcSizes: [1618, 1000],
  sizes: '(max-width:1300px) 809px, 809px',
  imgType: 'png',
};

const tabletImageProps: GridImg = {
  gridId: 'digitalSubscriptionHeaderTablet',
  altText: 'digital subscription',
  srcSizes: [811],
  sizes: '(max-width:980px) 500px, 400px',
  imgType: 'png',
};

const mobileImageProps: GridImg = {
  gridId: 'digitalSubscriptionHeaderMobile',
  altText: 'digital subscription',
  srcSizes: [432],
  sizes: '(max-width:360px) 338px, 165px',
  imgType: 'png',
};

export default function DigitalSubscriptionLandingHeader() {

  return (
    <LeftMarginSection>
      <div className="gridImage gridImage__desktop">
        <GridImage {...wideImageProps} />
      </div>
      <div className="gridImage gridImage__tablet">
        <GridImage {...tabletImageProps} />
      </div>
      <div className="gridImage gridImage__mobile">
        <GridImage {...mobileImageProps} />
      </div>
      <div className="headerTitle">
        Support The Guardian with<br />a digital subscription
      </div>
      <PriceCtaContainer dark />
    </LeftMarginSection>
  );
}
