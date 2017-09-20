// @flow

// ----- Imports ----- //

import React from 'react';

import { gridSrcset, gridUrl } from 'helpers/theGrid';

import type { ImageId } from 'helpers/theGrid';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type Source = {
  gridId: ImageId,
  sizes: string,
  media: string,
  srcSizes: number[],
};

/* eslint-enable react/no-unused-prop-types */

type PropTypes = {
  sources: Source[],
  fallback: string,
  fallbackSize: number,
  altText: ?string,
};


// ----- Component ----- //

export default function GridPicture(props: PropTypes) {

  const sources = props.sources.map((source) => {

    const srcSet = gridSrcset(source.gridId, source.srcSizes);
    return <source sizes={source.sizes} media={source.media} srcSet={srcSet} />;

  });

  return (
    <picture className="component-grid-picture">
      {sources}
      <img
        className="component-grid-picture__image"
        src={gridUrl(props.fallback, props.fallbackSize)}
        alt={props.altText}
      />
    </picture>
  );

}
