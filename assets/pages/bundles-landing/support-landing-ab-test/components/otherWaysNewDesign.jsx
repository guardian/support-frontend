// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import InfoSection from 'components/infoSection/infoSection';
import { getMemLink } from '../../helpers/externalLinks';

import OtherWaysCard from './otherWaysCardNewDesign';


// ----- Types ----- //

type PropTypes = {
  intCmp: ?string,
};

function mapStateToProps(state) {
  return {
    intCmp: state.common.referrerAcquisitionData.campaignCode,
  };
}


// ----- Component ----- //

function OtherWays(props: PropTypes) {

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
          ctaUrl={getMemLink('patrons', props.intCmp)}
        />
        <OtherWaysCard
          heading="Live events"
          copy="Meet Guardian journalists and readers at our events, debates, interviews and festivals"
          ctaText="Find out about events"
          gridImg="liveEvent"
          imgAlt="live event"
          ctaUrl={getMemLink('events', props.intCmp)}
        />
      </InfoSection>
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(OtherWays);
