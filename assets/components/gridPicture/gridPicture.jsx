// @flow

// ----- Imports ----- //

import { gridSrcset } from 'helpers/theGrid';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type Source = {
  gridId: string,
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
    return <source media={source.media} srcSet={srcSet} />;

  });

  return (
    <picture className="component-picture">
      {sources}
      <img
        className="component-picture__image"
        src={props.fallback}
        alt={props.altText}
      />
    </picture>
  );

}
