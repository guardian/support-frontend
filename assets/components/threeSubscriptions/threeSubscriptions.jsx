// @flow

// ----- Imports ----- //

import React from 'react';

import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';

import PageSection from 'components/pageSection/pageSection';
import { DigitalBundle } from 'components/digitalSubscriptions/digitalSubscriptions';
import { PaperBundle, PaperDigitalBundle } from 'components/paperSubscriptions/paperSubscriptions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { HeadingSize } from 'components/heading/heading';


// ----- Types ----- //

type ClickEvent = () => void;

type PropTypes = {
  referrerAcquisitionData: ReferrerAcquisitionData,
  digitalHeadingSize: HeadingSize,
  paperHeadingSize: HeadingSize,
  paperDigitalHeadingSize: HeadingSize,
  clickEvents: ?{
    digital: ClickEvent,
    paper: ClickEvent,
    paperDigital: ClickEvent,
  },
};


// ----- Component ----- //

function ThreeSubscriptions(props: PropTypes) {

  const countryGroupId = 'GBPCountries'; // This component is only used in the UK

  const subsLinks = getSubsLinks(
    countryGroupId,
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    [],
    props.referrerAcquisitionData,
  );

  return (
    <div className="component-three-subscriptions">
      <PageSection heading="Subscribe" modifierClass="three-subscriptions">
        <DigitalBundle
          countryGroupId={countryGroupId}
          url={subsLinks.DigitalPack}
          headingSize={props.digitalHeadingSize}
          onClick={props.clickEvents ? props.clickEvents.digital : null}
        />
        <PaperBundle
          countryGroupId={countryGroupId}
          url={subsLinks.Paper}
          headingSize={props.paperHeadingSize}
          onClick={props.clickEvents ? props.clickEvents.paper : null}
        />
        <PaperDigitalBundle
          countryGroupId={countryGroupId}
          url={subsLinks.PaperAndDigital}
          headingSize={props.paperDigitalHeadingSize}
          onClick={props.clickEvents ? props.clickEvents.paperDigital : null}
        />
      </PageSection>
    </div>
  );

}


// ----- Default Props ----- //

ThreeSubscriptions.defaultProps = {
  clickEvents: null,
};


// ----- Exports ----- //

export default ThreeSubscriptions;
