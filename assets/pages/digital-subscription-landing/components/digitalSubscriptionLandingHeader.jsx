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
  const leftMarginProps = {
    modifierClasses: ['header-block'],
  };
  return (
    <LeftMarginSection {...leftMarginProps}>
      <CirclesLeft />
      <div className="gridPicture">
        <GridPicture {...gridPicture} />
      </div>
      <CirclesRight />
      <div className="headerTitle">
        <div className="headerTitleCopy">
          Support The Guardian with a digital subscription
        </div>
      </div>
      <PriceCtaContainer dark />
    </LeftMarginSection>
  );
}

// ----- Aux Components ----- //

function CirclesLeft() {
  return (
    <div>
      <svg
        className="svg-title-circles--left__mobile"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 144 158"
        preserveAspectRatio="xMinYMid"
      >
        <circle cx="96" cy="48" r="48" fill="#ffe501" />
        <circle cx="28" cy="82" r="28" fill="#dcdcdc" />
        <circle cx="71" cy="125" r="33" fill="#00b2ff" />
      </svg>
      <svg
        className="svg-title-circles--left__tablet"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 356 417"
        preserveAspectRatio="xMinYMid"
      >
        <circle cx="48" cy="221" r="35" fill="#ffe501" />
        <circle cx="211" cy="146" r="145" fill="#ff7f0f" />
        <circle cx="83" cy="334" r="83" fill="#ffabdb" />
      </svg>
    </div>
  );
}

function CirclesRight() {
  return (
    <div>
      <svg
        className="svg-title-circles--right__mobile"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 74 144"
        preserveAspectRatio="xMinYMid"
      >
        <circle cx="50" cy="38" r="18" fill="#ffe501" />
        <circle cx="5" cy="28" r="28" fill="#dcdcdc" />
        <circle cx="28" cy="98" r="46" fill="#ffabdb" />
      </svg>
      <svg
        className="svg-title-circles--right__tablet"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 167 234"
        preserveAspectRatio="xMinYMid"
      >
        <circle cx="58" cy="35" r="35" fill="#00b2ff" />
        <circle cx="83" cy="150" r="83" fill="#ffef01" />
      </svg>
    </div>
  );
}
