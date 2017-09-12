// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';
import CtaCircle from 'components/ctaCircle/ctaCircle';


// ----- Component ----- //

export default function WhySupport() {

  return (
    <div className="why-support-new-design">
      <InfoSection heading="why support?" className="why-support-new-design__content gu-content-margin">
        <div className="why-support-new-design__wrapper">
          <h1 className="why-support-new-design__heading why-support-new-design__heading--edits">
            <span>no one edits</span>
            <span>our editor</span>
          </h1>
          <p className="why-support-new-design__copy">
            With no billionaire owner pulling our strings, nobody, be they
            shareholders or advertisers, can tell us to censor or drop a story.
          </p>
          <CtaCircle text="Find out more about our independence" />
          <h1 className="why-support-new-design__heading why-support-new-design__heading--advertising">
            <span>advertising revenues</span>
            <span>are falling</span>
          </h1>
          <p className="why-support-new-design__copy">
            Our quality, investigative journalism takes a lot of time and money
            to produce. And while the Scott Trust safeguards our independence, its
            funds are limited.
          </p>
          <p className="why-support-new-design__copy why-support-new-design__copy--no-border">
            With ad revenues falling across the media, we need our readers&#39;
            support to secure our future.
          </p>
          <CtaCircle text="Find out more about the Scott Trust" />
          <h1 className="why-support-new-design__heading why-support-new-design__heading--paywall">
            <span>we haven&#39;t put up </span>
            <span>a paywall</span>
          </h1>
          <p className="why-support-new-design__copy">
            We believe the truth should be open to everyone, regardless of their
            income or background
          </p>
          <h1 className="why-support-new-design__heading why-support-new-design__heading--perspective">
            <span>we believe</span>
            <span>our perspective matters</span>
          </h1>
          <p className="why-support-new-design__copy">
            Independent, progressive journalism is for everyone&#39;s benefit. And
            if that&#39;s a view you share, then join us today and help ensure our
            voice continues to be heard.
          </p>
        </div>
      </InfoSection>
    </div>
  );

}
