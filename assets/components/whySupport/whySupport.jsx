// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
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
    <PageSection heading="Why support?" modifierClass="why-support">
      <div className="component-why-support">
        <h1 className="component-why-support__heading component-why-support__heading--edits">
          <SvgScribble />
          <div className="component-why-support__heading-text-wrapper">
            <span className="component-why-support__subheading">No one edits</span>
            <span className="component-why-support__subheading component-why-support__subheading--edits-indented">
              our editor
            </span>
          </div>
        </h1>
        <p className="component-why-support__copy">
          Your support is vital in helping the Guardian do the most important
          journalism of all: that which takes time and effort. More people
          than ever now read and support the Guardian&#39;s independent,
          quality and investigative journalism.
        </p>
        <h1 className="component-why-support__heading component-why-support__heading--advertising">
          <span className="component-why-support__subheading">Advertising revenues</span>
          <span className="component-why-support__subheading component-why-support__subheading--advertising-indented">
            are falling
          </span>
          <SvgGraphLine />
          <SvgGraphLineMobile />
        </h1>
        <p className="component-why-support__copy">
          Like many media organisations, the Guardian is operating in an
          incredibly challenging commercial environment, and the advertising
          that we used to rely on to fund our work continues to fall.
        </p>
        <h1 className="component-why-support__heading component-why-support__heading--paywall">
          <span className="component-why-support__subheading">We haven&#39;t put up </span>
          <span className="component-why-support__subheading component-why-support__subheading--paywall-indented">
            a paywall
          </span>
          <div className="component-why-support__paywall-svg ">
            <SvgWallDesktop />
            <SvgWallMobile />
          </div>
        </h1>
        <p className="component-why-support__copy">
          We want to keep our journalism as open as we can.
        </p>
      </div>
    </PageSection>
  );

}
