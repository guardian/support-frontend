// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';
import {
  SvgScribble,
  SvgGraphLine,
  SvgGraphLineMobile,
  SvgWallDesktop,
  SvgWallMobile,
} from 'components/svg/svg';


// ----- Component ----- //

export default function WhySupport() {

  return (
    <div className="why-support-new-design">
      <InfoSection heading="why support?" className="why-support-new-design__content gu-content-margin">
        <div className="why-support-new-design__wrapper">
          <p className="why-support-new-design__copy why-support-new-design__copy--no-border">
            Your support is vital in helping the Guardian do the most important
            journalism of all: that which takes time and effort. More people
            than ever now read and support the Guardian&#39;s independent,
            quality and investigative journalism.
          </p>
          <h1 className="why-support-new-design__heading why-support-new-design__heading--advertising">
            <span>advertising revenues</span>
            <span>are falling</span>
            <SvgGraphLine />
            <SvgGraphLineMobile />
          </h1>
          <p className="why-support-new-design__copy">
            Like many media organisations, the Guardian is operating in an
            incredibly challenging commercial environment, and the advertising
            that we used to rely on to fund our work continues to fall.
          </p>
          <h1 className="why-support-new-design__heading why-support-new-design__heading--paywall">
            <span>we haven&#39;t put up </span>
            <span>a paywall</span>
            <div className="why-support-new-design__paywall-svg">
              <SvgWallDesktop />
              <SvgWallMobile />
            </div>
          </h1>
          <p className="why-support-new-design__copy">
            We want to keep our journalism as open as we can.
          </p>
          <h1 className="why-support-new-design__heading why-support-new-design__heading--edits">
            <SvgScribble />
            <div className="why-support-new-design__heading-text-wrapper">
              <span>no one edits</span>
              <span>our editor</span>
            </div>
          </h1>
          <p className="why-support-new-design__copy">
            We don&#39;t have a billionaire owner pulling our strings. Our owner,
            the Scott Trust, safeguards our editorial independence from
            commercial or political interference and reinvests revenue into our
            journalism, as opposed to into shareholders&#39; pockets.
          </p>
          <h1 className="why-support-new-design__heading why-support-new-design__heading--perspective">
            <span>we believe</span>
            <span>our perspective matters</span>
          </h1>
          <p className="why-support-new-design__copy">
            Help to make the Guardian&#39;s journalism have as big an impact as
            possible: by supporting it, by advocating for it and by
            participating in it so that together we can continue to tell the
            stories that matter, to inform the world and to make it a better
            place.
          </p>
        </div>
      </InfoSection>
    </div>
  );

}
