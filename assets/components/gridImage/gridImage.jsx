// @flow

// ----- Imports ----- //

import { gridUrl, gridSrcset } from 'helpers/theGrid';
import { ascending } from 'helpers/utilities';


// ----- Constants ----- //

const MIN_IMG_WIDTH = 300;


// ----- Types ----- //

type PropTypes = {
  gridId: string,
  srcSizes: number[],
  sizes: string,
  altText: ?string,
};


// ----- Component ----- //

export default function GridImage(props: PropTypes) {

  if (props.srcSizes.length < 1) {
    return null;
  }

  const sorted = props.srcSizes.sort(ascending);
  const srcSet = gridSrcset(props.gridId, sorted);

  const fallbackSize = sorted.find(_ => _ > MIN_IMG_WIDTH) || sorted[0];
  const fallbackSrc = gridUrl(props.gridId, fallbackSize);

  return (
    <img
      sizes={props.sizes}
      srcSet={srcSet}
      src={fallbackSrc}
      alt={props.altText}
    />
  );

}
