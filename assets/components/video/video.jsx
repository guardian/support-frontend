// @flow

// ----- Imports ----- //

import React from 'react';

import type { GridImg } from '../gridImage/gridImage';
import GridImage from '../gridImage/gridImage';


// ----- Constants ----- //

const YOUTUBE_BASE = 'https://www.youtube.com/embed/';
const YOUTUBE_PARAMS = 'enablejsapi=1&wmode=transparent&rel=0';


// ----- Catalogue ----- //

const videoCatalogue: {
  scottTrustExplained: string,
} = {
  scottTrustExplained: 'jn4wAy1Xs5M',
};


// ----- Types ----- //

// Utility type: https://flow.org/en/docs/types/utilities/#toc-keys
export type VideoName = $Keys<typeof videoCatalogue>;

type PropTypes = {
  name: VideoName,
  poster: ?GridImg,
};


// ----- Functions ----- //

function youtubeUrl(name: VideoName): string {

  const youtubeId = videoCatalogue[name];
  const url = new URL(youtubeId, YOUTUBE_BASE);

  return `${url.toString()}?${YOUTUBE_PARAMS}`;

}


// ----- Component ----- //

export default function Video(props: PropTypes) {

  const poster = props.poster ? <GridImage {...props.poster} /> : null;

  return (
    <div className="component-video">
      <iframe
        src={youtubeUrl(props.name)}
        frameBorder="0"
        width="560"
        height="315"
        allowFullScreen
      />
      {poster}
    </div>
  );

}
