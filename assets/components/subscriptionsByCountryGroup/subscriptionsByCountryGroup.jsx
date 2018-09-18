// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type HeadingSize } from 'components/heading/heading';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type CommonState } from 'helpers/page/page';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getSubsLinks } from 'helpers/externalLinks';
import { classNameWithModifiers } from 'helpers/utilities';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

import DigitalSection from './components/digitalSection';
import PaperSection from './components/paperSection';
import InternationalSection from './components/internationalSection';


// ----- Types and State Mapping ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  headingSize: HeadingSize,
  referrerAcquisitionData: ReferrerAcquisitionData,
};

function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Setup ----- //

const appReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page';
const internationalAppReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page&utm_campaign=international_subs_landing_pages';


// ----- Component ----- //

function SubscriptionsByCountryGroup(props: PropTypes) {

  const {
    countryGroupId, headingSize, referrerAcquisitionData, ...otherProps
  } = props;
  const subsLinks = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
  );
  const className = classNameWithModifiers(
    'component-subscriptions-by-country-group',
    [countryGroups[countryGroupId].supportInternationalisationId],
  );

  if (countryGroupId === 'GBPCountries') {
    return (
      <div className={className} {...otherProps}>
        <DigitalSection
          headingSize={headingSize}
          subsLinks={subsLinks}
          countryGroupId={countryGroupId}
          appReferrer={appReferrer}
        />
        <PaperSection
          headingSize={headingSize}
          subsLinks={subsLinks}
          countryGroupId={countryGroupId}
        />
      </div>
    );
  }

  return (
    <div className={className} {...otherProps}>
      <InternationalSection
        headingSize={headingSize}
        subsLinks={subsLinks}
        appReferrer={internationalAppReferrer}
      />
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsByCountryGroup);
