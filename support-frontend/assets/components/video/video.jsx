// @flow

// ----- Imports ----- //

import React from 'react';

import { videoCatalogue, type VideoId } from 'helpers/youtube';


// ----- Types ----- //

type PropTypes = {
  videoId: VideoId,
  title: string,
};


// ----- Component ----- //

function Video(props: PropTypes) {

  const url = `https://www.youtube-nocookie.com/embed/${videoCatalogue[props.videoId]}?rel=0&amp;showinfo=0`;

  return (
    <div className="component-video">
      <iframe
        title={props.title}
        width="560"
        height="315"
        src={url}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  );

}


// ----- Exports ----- //

export default Video;
