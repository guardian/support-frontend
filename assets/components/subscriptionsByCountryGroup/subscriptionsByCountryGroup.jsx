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
import { getAppReferrer } from 'helpers/tracking/appStores';
import { type ComponentAbTest } from 'helpers/subscriptions';

import FeaturedProductTest from './components/featuredProductTest';
import DigitalSection from './components/digitalSection';
import PaperSection from './components/paperSection';
import InternationalSection from './components/internationalSection';


// ----- Types and State Mapping ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  headingSize: HeadingSize,
  referrerAcquisitionData: ReferrerAcquisitionData,
  appMedium: string,
};

function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Component ----- //

function SubscriptionsByCountryGroup(props: PropTypes) {

  const {
    countryGroupId, headingSize, referrerAcquisitionData, appMedium, ...otherProps
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

  const appReferrer = getAppReferrer(appMedium, countryGroupId);

  if (countryGroupId === 'GBPCountries') {
    return (
      <div className={className} {...otherProps}>
        <FeaturedProductTest
          countryGroupId="GBPCountries"
          digitalPackUrl={subsLinks.DigitalPack}
          digitalSection={(abTest: ComponentAbTest | void) => (
            <DigitalSection
              headingSize={headingSize}
              subsLinks={subsLinks}
              countryGroupId={countryGroupId}
              appReferrer={appReferrer}
              abTest={abTest}
            />
          )}
          paperSection={(abTest: ComponentAbTest | void) => (
            <PaperSection
              headingSize={headingSize}
              subsLinks={subsLinks}
              countryGroupId={countryGroupId}
              abTest={abTest}
            />
          )}
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
