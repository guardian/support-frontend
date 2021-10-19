// ----- Imports ----- //
import React from "react";
import type { GridImage, GridSlot, Source as GridSource } from "components/gridPicture/gridPicture";
import GridPicture from "components/gridPicture/gridPicture";
import type { ImageId as GridId } from "helpers/images/theGrid";
import "helpers/images/theGrid";
import LeftMarginSection from "components/leftMarginSection/leftMarginSection";
import type { CountryGroupId } from "helpers/internationalisation/countryGroup";
import "helpers/internationalisation/countryGroup";
// ----- Setup ----- //
type GridImages = {
  breakpoints: {
    mobile: GridImage;
    tablet: GridImage;
    desktop: GridImage;
  };
  fallback: GridId;
};
type ImagesByCountry = Record<CountryGroupId, GridImages>;
const defaultHeroes: GridImages = {
  breakpoints: {
    mobile: {
      gridId: 'editionsPackshotShort',
      srcSizes: [500],
      imgType: 'png'
    },
    tablet: {
      gridId: 'editionsPackshotShort',
      srcSizes: [500, 1000, 1800],
      imgType: 'png'
    },
    desktop: {
      gridId: 'editionsPackshotShort',
      srcSizes: [500, 1000, 1800],
      imgType: 'png'
    }
  },
  fallback: 'digitalSubscriptionHeaderDesktop'
};
const australiaHeroes: GridImages = {
  breakpoints: {
    mobile: {
      gridId: 'editionsPackshotAusShort',
      srcSizes: [500],
      imgType: 'png'
    },
    tablet: {
      gridId: 'editionsPackshotAusShort',
      srcSizes: [500, 1000, 1800],
      imgType: 'png'
    },
    desktop: {
      gridId: 'editionsPackshotAusShort',
      srcSizes: [500, 1000, 1800],
      imgType: 'png'
    }
  },
  fallback: 'digitalSubscriptionHeaderDesktop'
};
const heroesByCountry: ImagesByCountry = {
  GBPCountries: defaultHeroes,
  UnitedStates: defaultHeroes,
  International: defaultHeroes,
  EURCountries: defaultHeroes,
  NZDCountries: defaultHeroes,
  Canada: defaultHeroes,
  AUDCountries: australiaHeroes
};
type GridSlots = {
  mobile: GridSlot;
  tablet: GridSlot;
  desktop: GridSlot;
};
const gridSlots: GridSlots = {
  mobile: {
    sizes: '240px',
    media: '(max-width: 739px)'
  },
  tablet: {
    sizes: '407px',
    media: '(min-width: 740px) and (max-width: 1139px)'
  },
  desktop: {
    sizes: '809px',
    media: '(min-width: 1140px)'
  }
};

const ThankYouHero = ({
  countryGroupId
}: {
  countryGroupId: CountryGroupId;
}) => {
  const gridImages: GridImages = heroesByCountry[countryGroupId];
  const sources: GridSource[] = [{ ...gridSlots.mobile,
    ...gridImages.breakpoints.mobile
  }, { ...gridSlots.tablet,
    ...gridImages.breakpoints.tablet
  }, { ...gridSlots.desktop,
    ...gridImages.breakpoints.desktop
  }];
  return <div className="component-product-hero">
      <LeftMarginSection>
        <GridPicture sources={sources} fallback={gridImages.fallback} fallbackSize={500} altText="Digital subscription" fallbackImgType="png" />
      </LeftMarginSection>
    </div>;
}; // ----- Export ----- //


export default ThankYouHero;