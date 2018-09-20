// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import WhySupport from 'components/whySupport/whySupport';
import WhySupportVideo from 'components/whySupportVideo/whySupportVideo';

import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types and Map State/Props ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};

function mapStateToProps(state: { common: CommonState }) {
  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
  };
}


// ----- Component ----- //

function WhySupportByCountryGroup(props: PropTypes) {

  switch (props.countryGroupId) {

    case 'AUDCountries':
    case 'UnitedStates':
      return <WhySupport headingSize={3} id="why-support" />;
    default:
      return <WhySupportVideo headingSize={3} id="why-support" />;

  }

}


// ----- Exports ----- //

export default connect(mapStateToProps)(WhySupportByCountryGroup);
