// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type HeadingSize } from 'components/heading/heading';

import { type CountryGroupId, countryGroups } from 'helpers/internationalisation/countryGroup';
import { type CommonState } from 'helpers/page/commonReducer';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getSubsLinks } from 'helpers/externalLinks';
import { classNameWithModifiers } from 'helpers/utilities';
import { getAppReferrer } from 'helpers/tracking/appStores';
import { type Participations } from 'helpers/abTests/abtest';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import DigitalSection from './components/digitalSection';
import PaperSection from './components/paperSection';
import InternationalSection from './components/internationalSection';


// ----- Types and State Mapping ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  headingSize: HeadingSize,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  appMedium: string,
};

function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
  };

}


// ----- Component ----- //

function SubscriptionsByCountryGroup(props: PropTypes) {

  const {
    countryGroupId,
    headingSize,
    referrerAcquisitionData,
    appMedium,
    abParticipations,
    ...otherProps
  } = props;

  const subsLinks = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
    abParticipations,
  );

  const className = classNameWithModifiers(
    'component-subscriptions-by-country-group',
    [countryGroups[countryGroupId].supportInternationalisationId],
  );

  const appReferrer = getAppReferrer(appMedium, countryGroupId);

  if (countryGroupId === GBPCountries) {
    return (
      <div id="qa-component-subscriptions-by-country-group" className={className} {...otherProps}>
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
        countryGroupId={countryGroupId}
        appReferrer={appReferrer}
      />
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsByCountryGroup);
