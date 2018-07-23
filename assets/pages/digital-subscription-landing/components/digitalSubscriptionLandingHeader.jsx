// @flow

// ----- Imports ----- //

import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridPicture, {
  type PropTypes as GridPictureProps,
  type Source as GSource,
} from 'components/gridPicture/gridPicture';
import { type ImageId as GridId } from 'helpers/theGrid';
import { CirclesLeft, CirclesRight } from 'components/svgs/digitalSubscriptionLandingHeaderCircles';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import PriceCtaContainer from './priceCtaContainer';


// ----- Types ----- //

type PropTypes = {
  cgId: CountryGroupId
};

type GridSource = {
  gridId: GridId,
  srcSizes: number[],
  imgType: 'png' | 'jpg',
};

type GridSources = {
  sources: {
    mobile: GridSource,
    tablet: GridSource,
    desktop: GridSource,
  },
  fallback: GridId,
};

type GridSlot = {
  sizes: string,
  media: string,
};

type GridSlots = {
  mobile: GridSlot,
  tablet: GridSlot,
  desktop: GridSlot,
};


// ----- Setup ----- //

const defaultSources: GridSources = {
  sources: {
    mobile: {
      gridId: 'digitalSubscriptionHeaderMobile',
      srcSizes: [342, 684, 1200],
      imgType: 'png',
    },
    tablet: {
      gridId: 'digitalSubscriptionHeaderTablet',
      srcSizes: [500, 1000, 2000],
      imgType: 'png',
    },
    desktop: {
      gridId: 'digitalSubscriptionHeaderDesktop',
      srcSizes: [500, 1000, 2000, 4045],
      imgType: 'png',
    },
  },
  fallback: 'digitalSubscriptionHeaderDesktop',
};

const gridSourcesByCountry: {
  [CountryGroupId]: GridSources,
} = {
  GBPCountries: defaultSources,
  UnitedStates: defaultSources,
  International: defaultSources,
  AUDCountries: {
    sources: {
      mobile: {
        gridId: 'digitalSubscriptionHeaderMobileAU',
        srcSizes: [310, 620, 1088],
        imgType: 'png',
      },
      tablet: {
        gridId: 'digitalSubscriptionHeaderTabletAU',
        srcSizes: [500, 1000, 2000],
        imgType: 'png',
      },
      desktop: {
        gridId: 'digitalSubscriptionHeaderDesktopAU',
        srcSizes: [500, 1000, 2000, 4045],
        imgType: 'png',
      },
    },
    fallback: 'digitalSubscriptionHeaderDesktopAU',
  },
};

const gridSlots: GridSlots = {
  mobile: {
    sizes: '240px',
    media: '(max-width: 739px)',
  },
  tablet: {
    sizes: '407px',
    media: '(min-width: 740px) and (max-width: 1139px)',
  },
  desktop: {
    sizes: '809px',
    media: '(min-width: 1140px)',
  },
};


// ----- Functions ----- //

function gridPicture(cgId: CountryGroupId): GridPictureProps {

  const gridSources: GridSources = gridSourcesByCountry[cgId];

  const sources: GSource[] = [
    { ...gridSlots.mobile, ...gridSources.sources.mobile },
    { ...gridSlots.tablet, ...gridSources.sources.tablet },
    { ...gridSlots.desktop, ...gridSources.sources.desktop },
  ];

  return {
    sources,
    fallback: gridSources.fallback,
    fallbackSize: 500,
    altText: 'digital subscription',
    fallbackImgType: 'png',
  };

}


// ----- Component ----- //

export default function DigitalSubscriptionLandingHeader(props: PropTypes) {
  return (
    <div className="digital-subscription-landing-header">
      <LeftMarginSection modifierClasses={['header-block', 'grey']}>
        <CirclesLeft />
        <CirclesRight />
        <div className="digital-subscription-landing-header__picture">
          <GridPicture {...gridPicture(props.cgId)} />
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
