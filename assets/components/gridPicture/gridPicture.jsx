// @flow

// ----- Imports ----- //

import React from 'react';

import { GRID_DOMAIN, gridSrcset } from 'helpers/theGrid';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type Source = {
  gridId: string,
  sizes: string,
  media: string,
  srcSizes: number[],
};

/* eslint-enable react/no-unused-prop-types */

type PropTypes = {
  sources: Source[],
  fallback: string,
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
        src={`${GRID_DOMAIN}/${props.fallback}`}
        alt={props.altText}
      />
    </picture>
  );

}
