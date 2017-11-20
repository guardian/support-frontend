// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';

import OtherWaysCard from './otherWaysCardNewDesign';


// ----- Component ----- //

export default function OtherWays() {

  return (
    <div className="other-ways-new-design gu-content-filler">
      <InfoSection
        heading="other ways you can support us"
        className="other-ways-new-design__content gu-content-filler__inner"
      >
        <OtherWaysCard
          heading="Patrons"
          copy="The Patron tier is for those who want a deeper relationship with the Guardian and its journalists"
          ctaText="Find out more"
          gridImg="guardianObserverOffice"
          imgAlt="the Guardian and the Observer"
        />
        <OtherWaysCard
          heading="Live events"
          copy="Meet Guardian journalists and readers at our events, debates, interviews and festivals"
          ctaText="Find out about events"
          gridImg="liveEvent"
          imgAlt="live event"
        />
      </InfoSection>
    </div>
  );

}
