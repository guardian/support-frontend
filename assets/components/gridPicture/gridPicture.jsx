// @flow

// ----- NOTE ----- //
// This code is designed to work with multiple image sources and crops (different pictures)
// If you want to work with a single image at different crops, maybe consider gridImage instead

// ----- Imports ----- //

import React from 'react';

import { gridSrcset, gridUrl } from 'helpers/theGrid';

import type { ImageId, ImageType } from 'helpers/theGrid';


// ----- Types ----- //

export type Source = {
  gridId: ImageId,
  sizes: string,
  media: string,
  srcSizes: number[],
  imgType: ImageType,
};

export type PropTypes = {
  sources: Source[],
  fallback: string,
  fallbackSize: number,
  altText: string,
  fallbackImgType: ImageType,
};


// ----- Component ----- //

export default function GridPicture(props: PropTypes) {

  const sources = props.sources.map((source) => {

    const srcSet = gridSrcset(source.gridId, source.srcSizes, source.imgType);
    return <source sizes={source.sizes} media={source.media} srcSet={srcSet} />;

  });

  return (
    <picture className="component-grid-picture">
      {sources}
      <img
        className="component-grid-picture__image"
        src={gridUrl(props.fallback, props.fallbackSize, props.fallbackImgType)}
        alt={props.altText}
      />
    </picture>
  );

}


// ----- Default Props ----- //

GridPicture.defaultProps = {
  altText: '',
  fallbackImgType: 'jpg',
};
