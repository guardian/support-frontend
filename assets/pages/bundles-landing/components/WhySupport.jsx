// @flow

// ----- Imports ----- //

import React from 'react';

import Svg from 'components/svg/svg';

import BodyCopy from 'components/bodyCopy/bodyCopy';
import Video from 'components/video/video';


// ----- Copy ----- //

const copy = {
  top: [
    'Your support is vital in helping the Guardian do the most important journalism of all: that which takes time and effort. Hundreds of thousands of readers now support the Guardian\'s independent, quality and investigative journalism.',
    'This is crucial, when like many media organisations, the Guardian is operating in an incredibly challenging commercial environment, and the advertising that we used to rely on to fund our work continues to fall.',
  ],
  bottom: [
    'We haven\'t put up a paywall – we want to keep our journalism as open as we can.',
    'We don’t have a billionaire owner pulling our strings. Our owner, the Scott Trust, safeguards our editorial independence from commercial or political interference and reinvests revenue into our journalism, as opposed to into shareholders\' pockets.',
    'Help to make the Guardian\'s journalism possible: by funding it, by reading it, by sharing it, and by participating in it so that together we can continue to tell the stories that matter, to inform the world and to make it a better place. ',
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
