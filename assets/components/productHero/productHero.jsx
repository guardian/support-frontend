// @flow

// ----- Imports ----- //

import React from 'react';

import GridPicture from 'components/gridPicture/gridPicture';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import {
  type GridImage,
  type GridSlot,
  type Source as GridSource,
} from 'components/gridPicture/gridPicture';
import SvgCirclesLeft from 'components/svgs/circlesLeft';
import SvgCirclesRight from 'components/svgs/circlesRight';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type ImageId as GridId, type ImageType } from 'helpers/theGrid';


// ----- Types ----- //

export type GridImages = {
  breakpoints: {
    mobile: GridImage,
    tablet: GridImage,
    desktop: GridImage,
  },
  fallback: GridId,
};

export type ImagesByCountry = {
  [CountryGroupId]: GridImages,
};

type PropTypes = {
  countryGroupId: CountryGroupId,
  imagesByCountry: ImagesByCountry,
  altText: string,
  fallbackImgType: ImageType,
};

type GridSlots = {
  mobile: GridSlot,
  tablet: GridSlot,
  desktop: GridSlot,
};


// ----- Setup ----- //

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


// ----- Component ----- //

function ProductHero(props: PropTypes) {

  const gridImages: GridImages = props.imagesByCountry[props.countryGroupId];

  const sources: GridSource[] = [
    { ...gridSlots.mobile, ...gridImages.breakpoints.mobile },
    { ...gridSlots.tablet, ...gridImages.breakpoints.tablet },
    { ...gridSlots.desktop, ...gridImages.breakpoints.desktop },
  ];

  return (
    <div className="component-product-hero">
      <LeftMarginSection>
        <SvgCirclesLeft />
        <SvgCirclesRight />
        <GridPicture
          sources={sources}
          fallback={gridImages.fallback}
          fallbackSize={500}
          altText={props.altText}
          fallbackImgType={props.fallbackImgType}
        />
      </LeftMarginSection>
    </div>
  );

}


// ----- Exports ----- //

export default ProductHero;
