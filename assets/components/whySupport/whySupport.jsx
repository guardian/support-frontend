// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';


// ----- Component ----- //

export default function WhySupport() {

  return (
    <div className="component-why-support">
      <PageSection heading="Why support?" modifierClass="why-support">
        <p className="component-why-support__copy">
          Your support is vital in helping the Guardian do the most important
          journalism of all: that which takes time and effort. More people
          than ever now read and support the Guardian&#39;s independent,
          quality and investigative journalism.
        </p>
        <p className="component-why-support__copy">
          Like many media organisations, the Guardian is operating in an
          incredibly challenging commercial environment, and the advertising
          that we used to rely on to fund our work continues to fall.
        </p>
        <p className="component-why-support__copy">
          We want to keep our journalism as open as we can.
        </p>
      </PageSection>
    </div>
  );

}
