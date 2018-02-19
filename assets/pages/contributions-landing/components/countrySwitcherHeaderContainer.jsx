// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import HeaderWitchCountrySwitcher from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { State } from '../bundlesLandingReducers';


const availableCountriesGroups: CountryGroupId[] =
  ['GBPCountries', 'UnitedStates', 'AUDCountries', 'EURCountries'];

// ----- Functions ----- //

function handleCountryGroupChange(value: string): void {
  switch (value) {
    case 'UnitedStates':
      window.location.href = '/us';
      break;
    case 'AUDCountries':
      window.location.href = '/au';
      break;
    case 'EURCountries':
      window.location.href = '/eu';
      break;
    default:
  }
}


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    countryGroupIds: availableCountriesGroups,
    selectedCountryGroup: state.common.countryGroup,
    onCountryGroupSelect: handleCountryGroupChange,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(HeaderWitchCountrySwitcher);
