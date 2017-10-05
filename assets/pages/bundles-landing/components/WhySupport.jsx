// @flow

// ----- Imports ----- //

import React from 'react';

import Svg from 'components/svg/svg';

import BodyCopy from 'components/bodyCopy/bodyCopy';
import Video from 'components/video/video';


// ----- Copy ----- //

const copy = {
  top: [
    'With no billionaire owner pulling our strings, nobody, be they shareholders or advertisers, can tell us to censor or drop a story.',
    'Our quality investigative journalism takes a lot of time and money to produce. And while the Scott Trust safeguards our independence, its funds are limited.',
  ],
  bottom: [
    'With ad revenues falling across the media, we need our readers\' support to secure our future and help hold power to account.',
    'Independent, progressive journalism benefits everyone. And if that\'s a view you share, join us today and help ensure our voice continues to be heard.',
  ],
  videoCaption: 'Katharine Viner, editor-in-chief, explains the Guardian\'s unique ownership model',
};


// ----- Component ----- //

export default function WhySupport() {

  return (
    <section className="why-support">
      <div className="why-support__content gu-content-margin">
        <div className="why-support__top-content">
          <div className="why-support__top-copy">
            <h1 className="why-support__heading">why do we need your support?</h1>
            <BodyCopy copy={copy.top} />
          </div>
          <Video name="scottTrustExplained" poster={null} />
        </div>
        <div className="why-support__bottom-content">
          <p className="why-support__video-caption">
            <Svg svgName="video" />
            {copy.videoCaption}
          </p>
          <BodyCopy copy={copy.bottom} />
        </div>
      </div>
    </section>
  );

}
