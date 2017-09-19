// @flow

// ----- Imports ----- //

import React from 'react';

import { gridUrl, gridSrcset } from 'helpers/theGrid';
import { ascending } from 'helpers/utilities';

import type { ImageType } from 'helpers/theGrid';


// ----- Constants ----- //

const MIN_IMG_WIDTH = 300;


// ----- Types ----- //

export type GridImg = {
  gridId: string,
  srcSizes: number[],
  sizes: string,
  altText: ?string,
  imgType?: ImageType,
}

type PropTypes = GridImg;


// ----- Component ----- //

export default function GridImage(props: PropTypes) {

  if (props.srcSizes.length < 1) {
    return null;
  }

  const sorted = props.srcSizes.sort(ascending);
  const srcSet = gridSrcset(props.gridId, sorted, props.imgType);

  const fallbackSize = sorted.find(_ => _ > MIN_IMG_WIDTH) || sorted[0];
  const fallbackSrc = gridUrl(props.gridId, fallbackSize, props.imgType);

  return (
    <img
      className="component-grid-image"
      sizes={props.sizes}
      srcSet={srcSet}
      src={fallbackSrc}
      alt={props.altText}
    />
  );

}


// ----- Default Props ----- //

GridImage.defaultProps = {
  imgType: 'jpg',
};
