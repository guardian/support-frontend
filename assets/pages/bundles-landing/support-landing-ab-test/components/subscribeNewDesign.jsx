// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import InfoSection from 'components/infoSection/infoSection';

import type { Campaign } from 'helpers/tracking/acquisitions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

import SubscriptionBundle from './subscriptionBundleNewDesign';
import { features as subscriptionFeatures } from '../helpers/subscriptionFeatures';
import { getSubsLinks } from '../../helpers/externalLinks';

import type { SubsUrls } from '../../helpers/externalLinks';


// ----- Props ----- //

type PropTypes = {
  intCmp: ?string,
  campaign: ?Campaign,
  otherQueryParams: Array<[string, string]>,
  referrerAcquisitionData: ReferrerAcquisitionData,
};

function mapStateToProps(state) {

  return {
    intCmp: state.common.referrerAcquisitionData.campaignCode,
    campaign: state.common.campaign,
    otherQueryParams: state.common.otherQueryParams,
    abTests: state.common.abParticipations,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Component ----- //

function Subscribe(props: PropTypes) {

  const subsLinks: SubsUrls = getSubsLinks(
    props.intCmp,
    props.campaign,
    props.otherQueryParams,
    props.referrerAcquisitionData,
  );

  return (
    <div className="subscribe-new-design">
      <InfoSection heading="subscribe" className="subscribe-new-design__content gu-content-margin">
        <div className="subscribe-new-design__bundles-wrapper">
          <SubscriptionBundle
            heading="digital"
            price="11.99"
            from={false}
            copy={subscriptionFeatures.digital}
            ctaText="Start your free trial"
            image="digitalBundle"
            ctaUrl={subsLinks.digital}
          />
          <SubscriptionBundle
            heading="paper"
            price="10.79"
            from
            copy={subscriptionFeatures.paper}
            ctaText="Get paper"
            image="paperBundle"
            ctaUrl={subsLinks.paper}
          />
          <SubscriptionBundle
            heading="paper + digital"
            price="22.06"
            from
            copy={subscriptionFeatures.paperDig}
            ctaText="Get paper + digital"
            image="paperDigitalBundle"
            ctaUrl={subsLinks.paperDig}
          />
        </div>
      </InfoSection>
    </div>
  );

}


// ----- Export ----- //

export default connect(mapStateToProps)(Subscribe);
